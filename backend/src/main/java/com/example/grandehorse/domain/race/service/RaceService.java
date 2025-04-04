package com.example.grandehorse.domain.race.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.horse.entity.HorseEntity;
import com.example.grandehorse.domain.horse.service.HorseService;
import com.example.grandehorse.domain.race.controller.request.CreateRaceRoomRequest;
import com.example.grandehorse.domain.race.controller.response.ChatMessageResponse;
import com.example.grandehorse.domain.race.controller.response.PlayerInfoResponse;
import com.example.grandehorse.domain.race.controller.response.RaceRoomResponse;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.RaceException;

@Service
public class RaceService {
	private static final String RACE_ROOM_PREFIX = "race_room:";

	private final RedisTemplate<String, Object> websocketRedisTemplate;
	private final SimpMessagingTemplate messagingTemplate;

	private final CardService cardService;
	private final HorseService horseService;
	private final UserService userService;

	public RaceService(
		@Qualifier("websocketRedisTemplate") RedisTemplate<String, Object> websocketRedisTemplate,
		SimpMessagingTemplate messagingTemplate,
		CardService cardService,
		HorseService horseService,
		UserService userService
	) {
		this.websocketRedisTemplate = websocketRedisTemplate;
		this.messagingTemplate = messagingTemplate;
		this.cardService = cardService;
		this.horseService = horseService;
		this.userService = userService;
	}

	public void broadcastRaceRooms() {
		List<RaceRoomResponse> raceRooms = getRaceRooms();
		messagingTemplate.convertAndSend("/topic/waiting_rooms", Map.of("raceRooms", raceRooms));
	}

	public void createRaceRoom(
		CreateRaceRoomRequest createRaceRoomDto,
		int userId,
		String sessionId
	) {
		Long roomId = websocketRedisTemplate.opsForValue().increment("roomIdCounter", 1);
		String roomKey = RACE_ROOM_PREFIX + roomId;

		if (websocketRedisTemplate.hasKey(roomKey)) {
			throw new RaceException(CustomError.RACE_ROOM_IS_ALREADY_EXISTED);
		}

		HashOperations<String, String, Object> hashOps = websocketRedisTemplate.opsForHash();
		Map<String, Object> raceRoom = Map.of(
			"roomId", String.valueOf(roomId),
			"roomName", createRaceRoomDto.getRoomName(),
			"currentPlayers", String.valueOf(0),
			"maxPlayers", String.valueOf(createRaceRoomDto.getMaxPlayers()),
			"rankRestriction", createRaceRoomDto.getRankRestriction().toLowerCase(),
			"bettingCoin", String.valueOf(createRaceRoomDto.getBettingCoin())
		);
		hashOps.putAll(roomKey, raceRoom);

		String ownerKey = roomKey + ":owner";
		websocketRedisTemplate.opsForValue().set(ownerKey, String.valueOf(userId));

		String startKey = roomKey + ":start";
		websocketRedisTemplate.opsForValue().set(startKey, "false");

		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		messagingTemplate.convertAndSendToUser(sessionId, "/queue/subscribe", String.valueOf(roomId),
			headerAccessor.getMessageHeaders());
	}

	public void joinRaceRoom(Long roomId, int userId, String sessionId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;

		if (!isRoomExisted(roomKey)) {
			sendErrorMessage(sessionId, CustomError.RACE_ROOM_NOT_EXISTED.getErrorCode());
		}
		// 대표말 에러 체크
		if (isRaceStarted(roomKey)) {
			sendErrorMessage(sessionId, CustomError.RACE_ALREADY_START.getErrorCode());
		}
		if (isRoomHasSpace(roomKey)) {
			sendErrorMessage(sessionId, CustomError.RACE_ROOM_MAX_PLAYER.getErrorCode());
		}

		CardEntity cardEntity = cardService.findRepresentativeCard(userId);
		HorseEntity horseEntity = horseService.findHorseById(cardEntity.getHorseId());
		String userNickname = userService.findNicknameById(userId);
		Boolean isRoomOwner = isRoomOwner(roomKey, userId);

		executeJoinScript(roomKey, userId, cardEntity, horseEntity, userNickname, isRoomOwner);

		String message = "[알림]" + userNickname + "님이 입장하셨습니다.";
		sendSystemMessage(roomId, message);

		broadcastPlayersInfo(roomId, roomKey);
		broadcastRaceRooms();
	}

	public void toggleReadyStatus(Long roomId, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		String userKey = roomKey + ":user:" + userId;

		Boolean currentStatus
			= Boolean.valueOf((String)websocketRedisTemplate.opsForHash().get(userKey, "isReady"));
		Boolean newStatus = !currentStatus;
		websocketRedisTemplate.opsForHash().put(userKey, "isReady", String.valueOf(newStatus));

		broadcastPlayersInfo(roomId, roomKey);
	}

	public void startRace(Long roomId, String sessionId, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;

		if (!isRoomOwner(roomKey, userId)) {
			sendErrorMessage(sessionId, CustomError.ONLY_OWNER_CAN_START_RACE.getErrorCode());
		}

		if (!isAllPlayersReady(roomKey)) {
			sendErrorMessage(sessionId, CustomError.NOT_ALL_PLAYERS_READY.getErrorCode());
		}

		String startKey = roomKey + ":start";
		websocketRedisTemplate.opsForValue().set(startKey, "true");

		sendSystemMessage(roomId, "[알림] 경주가 시작됩니다!");
	}

	public void leaveRaceRoom(Long roomId, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		String userKey = roomKey + ":user:" + userId;

		removeUserFromRoom(roomKey, userKey, userId);

		Set<Object> remainingPlayers = websocketRedisTemplate.opsForSet().members(roomKey + ":players");
		if (remainingPlayers.isEmpty()) {
			websocketRedisTemplate.delete(roomKey);
			sendSystemMessage(roomId, "DELETE");
			return;
		}

		String userNickname = getUserNickname(userKey);
		String message = "[알림] " + userNickname + "님이 방을 떠났습니다.";
		sendSystemMessage(roomId, message);

		boolean isRoomOwner = isRoomOwner(roomKey, userId);
		if (isRoomOwner) {
			assignNewRoomOwner(roomId, roomKey, remainingPlayers);
		}

		broadcastPlayersInfo(roomId, roomKey);
		broadcastRaceRooms();
	}

	public void sendChatMessage(Long roomId, int userId, String message) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		String userKey = roomKey + ":user:" + userId;
		String userNickname = websocketRedisTemplate.opsForHash().get(userKey, "userNickname").toString();

		long millis = System.currentTimeMillis();
		LocalTime time = Instant.ofEpochMilli(millis)
			.atZone(ZoneId.systemDefault())
			.toLocalTime();

		ChatMessageResponse chatMessage = new ChatMessageResponse(userNickname, message, time);
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId + "/chat", chatMessage);
	}

	private List<RaceRoomResponse> getRaceRooms() {
		Cursor<byte[]> cursor = websocketRedisTemplate.getConnectionFactory()
			.getConnection()
			.scan(ScanOptions.scanOptions().match(RACE_ROOM_PREFIX + "*").count(10).build());

		List<String> keys = new ArrayList<>();
		while (cursor.hasNext()) {
			String key = new String(cursor.next(), StandardCharsets.UTF_8);

			if (key.matches("race_room:\\d+")) {
				keys.add(key);
			}
		}

		if (keys.isEmpty()) {
			return List.of();
		}
		HashOperations<String, String, Object> hashOps = websocketRedisTemplate.opsForHash();

		return keys.stream()
			.map(key -> {
				Map<String, Object> roomData = hashOps.entries(key);
				return new RaceRoomResponse(
					Long.valueOf(roomData.get("roomId").toString()),
					roomData.get("roomName").toString(),
					Integer.parseInt(roomData.get("currentPlayers").toString()),
					Integer.parseInt(roomData.get("maxPlayers").toString()),
					roomData.get("rankRestriction").toString().toLowerCase(),
					Integer.parseInt(roomData.get("bettingCoin").toString())
				);
			})
			.sorted(Comparator.comparingLong(RaceRoomResponse::getRoomId).reversed())
			.collect(Collectors.toList());
	}

	private boolean isRoomExisted(String roomKey) {
		return websocketRedisTemplate.hasKey(roomKey);
	}

	private boolean isRaceStarted(String roomKey) {
		String started = websocketRedisTemplate.opsForValue().get(roomKey + ":start").toString();
		return "true".equals(started);
	}

	private boolean isRoomHasSpace(String roomKey) {
		int currentPlayers
			= Integer.parseInt(websocketRedisTemplate.opsForHash().get(roomKey, "currentPlayers").toString());
		int maxPlayers
			= Integer.parseInt(websocketRedisTemplate.opsForHash().get(roomKey, "maxPlayers").toString());
		return currentPlayers >= maxPlayers;
	}

	private void removeUserFromRoom(String roomKey, String userKey, int userId) {
		websocketRedisTemplate.opsForSet().remove(roomKey + ":players", userId);
		websocketRedisTemplate.delete(userKey);
		websocketRedisTemplate.opsForHash().increment(roomKey, "currentPlayers", -1);
	}

	private void assignNewRoomOwner(Long roomId, String roomKey, Set<Object> remainingPlayers) {
		Object newOwnerId = remainingPlayers.iterator().next();
		String newUserKey = roomKey + ":user:" + newOwnerId;

		websocketRedisTemplate.opsForHash().put(newUserKey, "isRoomOwner", "true");

		String newOwnerNickname = getUserNickname(newUserKey);
		String message = "[알림] " + newOwnerNickname + "님이 새로운 방장이 되었습니다.";
		sendSystemMessage(roomId, message);
	}

	private String executeJoinScript(
		String roomKey,
		int userId,
		CardEntity cardEntity,
		HorseEntity horseEntity,
		String userNickname,
		Boolean isRoomOwner
	) {
		String script = getJoinRaceRoomScript();
		RedisScript<String> redisScript = RedisScript.of(script, String.class);
		return websocketRedisTemplate.execute(
			redisScript,
			List.of(roomKey),
			String.valueOf(userId),
			String.valueOf(cardEntity.getId()),
			horseEntity.getId(),
			horseEntity.getName(),
			horseEntity.getCoatColor().toLowerCase(),
			horseEntity.getHorseRank().toLowerCase(),
			String.valueOf(horseEntity.getWeight()),
			String.valueOf(horseEntity.getSpeed()),
			String.valueOf(horseEntity.getAcceleration()),
			String.valueOf(horseEntity.getStamina()),
			userNickname,
			isRoomOwner.toString()
		);
	}

	private Boolean isRoomOwner(String roomKey, int userId) {
		String ownerKey = roomKey + ":owner";
		String ownerId = (String)websocketRedisTemplate.opsForValue().get(ownerKey);
		return ownerId != null && ownerId.equals(String.valueOf(userId));
	}

	private String getJoinRaceRoomScript() {
		return "local roomKey = KEYS[1]\n"
			+ "local userId = tonumber(ARGV[1])\n"
			+ "local cardId = tonumber(ARGV[2])\n"
			+ "local horseId = ARGV[3]\n"
			+ "local horseName = ARGV[4]\n"
			+ "local horseColor = ARGV[5]\n"
			+ "local horseRank = ARGV[6]\n"
			+ "local horseWeight = tonumber(ARGV[7])\n"
			+ "local horseSpeed = tonumber(ARGV[8])\n"
			+ "local horseAcceleration = tonumber(ARGV[9])\n"
			+ "local horseStamina = tonumber(ARGV[10])\n"
			+ "local userNickname = ARGV[11]\n"
			+ "local isRoomOwner = ARGV[12]\n"

			+ "local userKey = roomKey .. ':user:' .. userId\n"
			+ "redis.call('HSET', userKey, \n"
			+ "    'cardId', cardId, \n"
			+ "    'horseId', horseId, \n"
			+ "    'userNickname', userNickname, \n"
			+ "    'horseName', horseName, \n"
			+ "    'horseColor', horseColor, \n"
			+ "    'horseRank', horseRank, \n"
			+ "    'horseWeight', horseWeight, \n"
			+ "    'horseSpeed', horseSpeed, \n"
			+ "    'horseAcceleration', horseAcceleration, \n"
			+ "    'horseStamina', horseStamina, \n"
			+ "    'isReady', 'false', \n"
			+ "    'isRoomOwner', isRoomOwner\n"
			+ ")\n"

			+ "redis.call('RPUSH', roomKey .. ':players', userId)\n"
			+ "redis.call('HINCRBY', roomKey, 'currentPlayers', 1)\n"

			+ "return 'OK'";
	}

	private void broadcastPlayersInfo(Long roomId, String roomKey) {
		List<Object> playerIds = websocketRedisTemplate.opsForList().range(roomKey + ":players", 0, -1);
		List<PlayerInfoResponse> playersInfo = playerIds.stream()
			.map(id -> getPlayerInfo(roomKey, id))
			.collect(Collectors.toList());
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId, playersInfo);
	}

	private PlayerInfoResponse getPlayerInfo(String roomKey, Object id) {
		String userKey = roomKey + ":user:" + id;
		Map<Object, Object> playerInfo = websocketRedisTemplate.opsForHash().entries(userKey);
		return PlayerInfoResponse.builder()
			.userNickname((String)playerInfo.get("userNickname"))
			.horseName((String)playerInfo.get("horseName"))
			.horseColor((String)playerInfo.get("horseColor"))
			.horseRank((String)playerInfo.get("horseRank"))
			.isRoomOwner(Boolean.parseBoolean((String)playerInfo.get("isRoomOwner")))
			.isReady(Boolean.parseBoolean((String)playerInfo.get("isReady")))
			.build();
	}

	private boolean isAllPlayersReady(String roomKey) {
		Set<Object> playerIds = websocketRedisTemplate.opsForSet().members(roomKey + ":players");

		for (Object id : playerIds) {
			String userKey = roomKey + ":user:" + id;
			String isOwner = (String)websocketRedisTemplate.opsForValue().get(userKey + ":isRoomOwner");

			if ("true".equals(isOwner)) {
				continue;
			}

			Boolean isReady = Boolean.valueOf((String)websocketRedisTemplate.opsForValue().get(userKey + ":isReady"));
			if (!isReady) {
				return false;
			}
		}
		return true;
	}

	private String getUserNickname(String userKey) {
		Object nicknameObj = websocketRedisTemplate.opsForHash().get(userKey, "userNickname");
		return (nicknameObj != null) ? nicknameObj.toString() : "알 수 없는 유저";
	}

	private void sendSystemMessage(Long roomId, String message) {
		long millis = System.currentTimeMillis();
		LocalTime time = Instant.ofEpochMilli(millis)
			.atZone(ZoneId.systemDefault())
			.toLocalTime();
		ChatMessageResponse chatMessage = new ChatMessageResponse("SYSTEM", message, time);

		messagingTemplate.convertAndSend("/topic/race_room/" + roomId + "/chat", chatMessage);
	}

	private void sendErrorMessage(String sessionId, String errorCode) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		messagingTemplate.convertAndSendToUser(
			sessionId, "/queue/subscribe", errorCode, headerAccessor.getMessageHeaders());
	}
}
