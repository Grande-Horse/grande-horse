package com.example.grandehorse.domain.race.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.connection.DefaultStringRedisConnection;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisCallback;
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
import com.example.grandehorse.domain.race.controller.response.ChatMessage;
import com.example.grandehorse.domain.race.controller.response.GameResult;
import com.example.grandehorse.domain.race.controller.response.PlayerInfo;
import com.example.grandehorse.domain.race.controller.response.PlayerRaceProgress;
import com.example.grandehorse.domain.race.controller.response.RaceRoom;
import com.example.grandehorse.domain.race.controller.response.RaceRoomError;
import com.example.grandehorse.domain.race.repository.RaceJpaRepository;
import com.example.grandehorse.domain.race.repository.RaceRecordJpaRepository;
import com.example.grandehorse.domain.user.entity.UserEntity;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.RaceException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class RaceService {
	private static final String RACE_ROOM_PREFIX = "race_room:";
	private static final Map<String, Integer> RANK_PRIORITY = Map.of(
		"all", 6,
		"legend", 5,
		"unique", 4,
		"epic", 3,
		"rare", 2,
		"normal", 1
	);

	private final Map<Long, Thread> roomQueueWorkers = new ConcurrentHashMap<>();
	private final RedisTemplate<String, Object> websocketRedisTemplate;
	private final SimpMessagingTemplate messagingTemplate;

	private final CardService cardService;
	private final HorseService horseService;
	private final UserService userService;
	private final RaceResultService raceResultService;

	private final RaceJpaRepository raceJpaRepository;
	private final RaceRecordJpaRepository raceRecordJpaRepository;

	public RaceService(
		@Qualifier("websocketRedisTemplate") RedisTemplate<String, Object> websocketRedisTemplate,
		SimpMessagingTemplate messagingTemplate,
		CardService cardService,
		HorseService horseService,
		UserService userService,
		RaceResultService raceResultService,
		RaceJpaRepository raceJpaRepository,
		RaceRecordJpaRepository raceRecordJpaRepository
	) {
		this.websocketRedisTemplate = websocketRedisTemplate;
		this.messagingTemplate = messagingTemplate;
		this.cardService = cardService;
		this.horseService = horseService;
		this.userService = userService;
		this.raceResultService = raceResultService;
		this.raceJpaRepository = raceJpaRepository;
		this.raceRecordJpaRepository = raceRecordJpaRepository;
	}

	public void getInitialWaitingRooms(String sessionId) {
		Map<String, Object> response = new HashMap<>();
		response.put("type", "initialRooms");
		List<RaceRoom> raceRooms = getRaceRooms();
		response.put("initialRooms", raceRooms);
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		messagingTemplate.convertAndSendToUser(sessionId, "/queue/subscribe", response,
			headerAccessor.getMessageHeaders());
	}

	public void broadcastRaceRooms() {
		List<RaceRoom> raceRooms = getRaceRooms();
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
			"bettingCoin", String.valueOf(createRaceRoomDto.getBettingCoin()),
			"start", "false"
		);
		hashOps.putAll(roomKey, raceRoom);

		String ownerKey = roomKey + ":owner";
		websocketRedisTemplate.opsForValue().set(ownerKey, String.valueOf(userId));

		Map<String, Object> response = new HashMap<>();
		response.put("type", "createRoom");
		response.put("roomId", String.valueOf(roomId));
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		messagingTemplate.convertAndSendToUser(sessionId, "/queue/subscribe", response,
			headerAccessor.getMessageHeaders());
	}

	public void joinRaceRoom(Long roomId, int userId, String sessionId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;

		CardEntity cardEntity = cardService.findRepresentativeCard(userId);
		HorseEntity horseEntity = horseService.findHorseById(cardEntity.getHorseId());
		String userNickname = userService.findNicknameById(userId);
		Boolean isRoomOwner = isRoomOwner(roomKey, userId);

		if (!isRoomExisted(roomKey)) {
			sendErrorMessage(sessionId, CustomError.RACE_ROOM_NOT_EXISTED.getErrorCode());
			return;
		}

		if (!hasUserRepresentativeHorseCard(userId)) {
			sendErrorMessage(sessionId, CustomError.USER_HAS_NOT_REPRESENTATIVE_HORSE_CARD.getErrorCode());
			return;
		}

		if (!hasUserEnoughCoin(userId, roomKey)) {
			sendErrorMessage(sessionId, CustomError.USER_HAS_NOT_ENOUGH_COIN.getErrorCode());
			return;
		}

		if (!isHorseGradeValidForRace(roomKey, horseEntity)) {
			sendErrorMessage(sessionId, CustomError.HORSE_RANK_EXCEEDS_ROOM_RESTRICTION.getErrorCode());
			return;
		}

		if (isUserExistedInRoom(roomKey, userId)) {
			sendErrorMessage(sessionId, CustomError.ALREADY_EXIST_USER.getErrorCode());
			broadcastPlayersInfo(roomId, roomKey);
			return;
		}

		if (isRaceStarted(roomKey)) {
			sendErrorMessage(sessionId, CustomError.RACE_ALREADY_START.getErrorCode());
			return;
		}
		if (!hasRoomSpace(roomKey)) {
			sendErrorMessage(sessionId, CustomError.RACE_ROOM_MAX_PLAYER.getErrorCode());
			return;
		}

		executeJoinScript(roomKey, userId, cardEntity, horseEntity, userNickname, isRoomOwner);

		String message = "[알림] " + userNickname + "님이 입장하셨습니다.";
		sendSystemMessage(roomId, message);

		broadcastPlayersInfo(roomId, roomKey);
		broadcastRaceRooms();
	}

	private boolean isHorseGradeValidForRace(String roomKey, HorseEntity horse) {
		String horseRank = horse.getHorseRank().toLowerCase();
		String rankRestriction = websocketRedisTemplate.opsForHash().get(roomKey, "rankRestriction").toString();

		System.out.println(horseRank + " " + rankRestriction);
		return RANK_PRIORITY.get(horseRank) <= RANK_PRIORITY.get(rankRestriction);
	}

	private boolean hasUserEnoughCoin(int userId, String roomKey) {
		UserEntity user = userService.findUserById(userId);
		int coin = user.getCoin();
		int bettingCoin = Integer.parseInt(
			websocketRedisTemplate.opsForHash().get(roomKey, "bettingCoin").toString()
		);

		return coin >= bettingCoin;
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
			return;
		}

		if (!isAllPlayersReady(roomKey)) {
			sendErrorMessage(sessionId, CustomError.NOT_ALL_PLAYERS_READY.getErrorCode());
			return;
		}

		websocketRedisTemplate.opsForHash().put(roomKey, "start", "true");
		sendSystemMessage(roomId, "[알림] 경주가 시작됩니다!");

		broadcastPlayersInfo(roomId, roomKey);
		broadcastRaceRooms();
	}

	public void leaveRaceRoom(Long roomId, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		String userKey = roomKey + ":user:" + userId;

		removeUserFromRoom(roomId, userKey, userId);
		websocketRedisTemplate.delete("user:" + userId + ":room");
		List<Object> remainingPlayerIds
			= websocketRedisTemplate.opsForList().range(roomKey + ":players", 0, -1);
		if (remainingPlayerIds.isEmpty()) {
			websocketRedisTemplate.delete(roomKey);
			websocketRedisTemplate.delete(roomKey + ":owner");

			broadcastRaceRooms();
			return;
		}

		boolean isRoomOwner = isRoomOwner(roomKey, userId);
		if (isRoomOwner) {
			assignNewRoomOwner(roomId, roomKey, remainingPlayerIds);
		}

		broadcastPlayersInfo(roomId, roomKey);
		broadcastRaceRooms();
	}

	public void forceLeaveRoom(int userId) {
		String userRoomKey = "user:" + userId + ":room";
		String roomKey = (String)websocketRedisTemplate.opsForValue().get(userRoomKey);

		if (roomKey == null) {
			return;
		}

		Long roomId = Long.parseLong(roomKey.replace(RACE_ROOM_PREFIX, ""));
		leaveRaceRoom(roomId, userId);
	}

	public void sendChatMessage(Long roomId, int userId, String message) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		String userKey = roomKey + ":user:" + userId;
		String userNickname = getUserNickname(userKey);

		long millis = System.currentTimeMillis();
		LocalTime time = Instant.ofEpochMilli(millis)
			.atZone(ZoneId.systemDefault())
			.toLocalTime();

		ChatMessage chatMessage = new ChatMessage(userNickname, message, time);
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId + "/chat", chatMessage);
	}

	public void requestPlayGame(Long roomId, int userId) {
		String queueKey = "queue:playGame:" + roomId;
		websocketRedisTemplate.opsForList().rightPush(queueKey, String.valueOf(userId));

		if (!roomQueueWorkers.containsKey(roomId)) {
			log.info("Creating new worker for room {}", roomId);
			Thread worker = new Thread(() -> startGameQueueWorker(roomId));
			worker.start();
			roomQueueWorkers.put(roomId, worker);
		}
	}

	public void startGameQueueWorker(Long roomId) {
		String queueKey = "queue:playGame:" + roomId;
		log.info("Async Worker started for room {}", roomId);

		while (!Thread.currentThread().isInterrupted()) {
			try {
				log.info("Waiting for user action in queue: {}", queueKey);
				List<String> result = websocketRedisTemplate.execute((RedisCallback<List<String>>)connection -> {
					DefaultStringRedisConnection stringConnection = new DefaultStringRedisConnection(connection);
					return stringConnection.bLPop(0, queueKey);
				});

				if (result != null && result.size() == 2) {
					String userIdStr = result.get(1);
					log.info("Received userId: {} for room: {}", userIdStr, roomId);

					playGame(roomId, Integer.parseInt(userIdStr));
				}

			} catch (Exception e) {
				log.error("GameQueueWorker error - roomId: {}", roomId, e);
				break;
			}
		}

		log.info("Game queue worker for room {} has stopped.", roomId);
		roomQueueWorkers.remove(roomId);
	}

	private void playGame(Long roomId, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		String startFlag = (String)websocketRedisTemplate.opsForHash().get(roomKey, "start");
		if (!Boolean.parseBoolean(startFlag)) {
			log.warn("Race already finished. Skipping move for user {}", userId);
			return;
		}

		List<Object> playerIds = websocketRedisTemplate.opsForList().range(roomKey + ":players", 0, -1);
		List<PlayerRaceProgress> raceProgresses = new ArrayList<>();
		Map<Integer, Double> distanceMap = new HashMap<>();

		for (Object idObj : playerIds) {
			int currentUserId = Integer.parseInt(idObj.toString());
			String userKey = roomKey + ":user:" + currentUserId;

			double distance = getPlayerDistance(userKey);

			if (currentUserId == userId) {
				startFlag = (String)websocketRedisTemplate.opsForHash().get(roomKey, "start");
				if (!Boolean.parseBoolean(startFlag)) {
					log.warn("Race finished during user {}'s move. Skipping move.", userId);
					return;
				}

				double moveDistance
					= calculateDistance(websocketRedisTemplate.opsForHash().entries(userKey), distance);
				distance += moveDistance;

				websocketRedisTemplate.opsForHash().put(userKey, "distance", String.valueOf(distance));

				log.info("User {} moved. Current distance: {}", currentUserId, distance);
			}

			raceProgresses.add(new PlayerRaceProgress(currentUserId, distance));
			distanceMap.put(currentUserId, distance);
		}

		boolean isRaceFinished = distanceMap.values().stream().anyMatch(d -> d >= 1900.0);
		if (isRaceFinished) {
			try {
				int playerCount = playerIds.size();
				int bettingCoin = Integer.parseInt(
					String.valueOf(websocketRedisTemplate.opsForHash().get(roomKey, "bettingCoin"))
				);

				List<GameResult> gameResults = raceResultService.processRaceResult(
					bettingCoin,
					playerCount,
					roomKey,
					raceProgresses,
					websocketRedisTemplate
				);

				sendRaceProgress(roomId, raceProgresses);

				for (Object idObj : playerIds) {
					int currentUserId = Integer.parseInt(idObj.toString());
					String userKey = roomKey + ":user:" + currentUserId;
					websocketRedisTemplate.opsForHash().put(userKey, "isReady", "false");
					websocketRedisTemplate.opsForHash().put(userKey, "distance", "0.0");
				}

				websocketRedisTemplate.delete("queue:playGame:" + roomId);
				websocketRedisTemplate.opsForHash().put(roomKey, "start", "false");

				sendRaceResult(roomId, gameResults);
				broadcastRaceRooms();

				return;

			} finally {
				Thread worker = roomQueueWorkers.get(roomId);
				if (worker != null) {
					roomQueueWorkers.remove(roomId);
					worker.interrupt();
				}
			}
		}

		sendRaceProgress(roomId, raceProgresses);
	}

	private List<RaceRoom> getRaceRooms() {
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

				if (roomData.isEmpty()) {
					return null;
				}

				return new RaceRoom(
					Long.valueOf(roomData.get("roomId").toString()),
					roomData.get("roomName").toString(),
					Integer.parseInt(roomData.get("currentPlayers").toString()),
					Integer.parseInt(roomData.get("maxPlayers").toString()),
					roomData.get("rankRestriction").toString().toLowerCase(),
					Integer.parseInt(roomData.get("bettingCoin").toString()),
					Boolean.parseBoolean(roomData.get("start").toString())
				);
			})
			.sorted(Comparator.comparingLong(RaceRoom::getRoomId).reversed())
			.collect(Collectors.toList());
	}

	private boolean isRoomExisted(String roomKey) {
		return websocketRedisTemplate.hasKey(roomKey);
	}

	private boolean hasUserRepresentativeHorseCard(int userId) {
		return cardService.hasRepresentativeHorseCard(userId);
	}

	private boolean isUserExistedInRoom(String roomKey, int userId) {
		List<Object> playerIds = websocketRedisTemplate.opsForList()
			.range(roomKey + ":players", 0, -1);

		if (playerIds == null) {
			return false;
		}

		String targetId = String.valueOf(userId);
		return playerIds.stream()
			.map(Object::toString)
			.anyMatch(id -> id.equals(targetId));
	}

	private boolean isRaceStarted(String roomKey) {
		String started = websocketRedisTemplate.opsForHash().get(roomKey, "start").toString();
		return "true".equals(started);
	}

	private boolean hasRoomSpace(String roomKey) {
		int currentPlayers
			= Integer.parseInt(websocketRedisTemplate.opsForHash().get(roomKey, "currentPlayers").toString());
		int maxPlayers
			= Integer.parseInt(websocketRedisTemplate.opsForHash().get(roomKey, "maxPlayers").toString());
		return currentPlayers < maxPlayers;
	}

	private void removeUserFromRoom(Long roomId, String userKey, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;

		String userNickname = getUserNickname(userKey);
		String message = "[알림] " + userNickname + "님이 방을 떠났습니다.";

		websocketRedisTemplate.opsForList().remove(roomKey + ":players", 1, String.valueOf(userId));
		websocketRedisTemplate.delete(userKey);
		websocketRedisTemplate.delete("user:" + userId + ":room");
		websocketRedisTemplate.opsForHash().increment(roomKey, "currentPlayers", -1);
		sendSystemMessage(roomId, message);
	}

	private void assignNewRoomOwner(Long roomId, String roomKey, List<Object> remainingPlayers) {
		Object newOwnerId = remainingPlayers.iterator().next();
		String newUserKey = roomKey + ":user:" + newOwnerId;
		String ownerKey = roomKey + ":owner";

		websocketRedisTemplate.opsForValue().set(ownerKey, newOwnerId.toString());
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
			+ "    'userId', userId, \n"
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

			+ "local userRoomKey = 'user:' .. userId .. ':room'\n"
			+ "redis.call('SET', userRoomKey, roomKey)\n"

			+ "return 'OK'";
	}

	private void broadcastPlayersInfo(Long roomId, String roomKey) {
		List<Object> playerIds = websocketRedisTemplate.opsForList().range(roomKey + ":players", 0, -1);
		List<PlayerInfo> playersInfo = playerIds.stream()
			.map(id -> getPlayerInfo(roomKey, Integer.parseInt(id.toString())))
			.collect(Collectors.toList());
		Map<String, Object> response = new HashMap<>();

		boolean started = Boolean.valueOf(websocketRedisTemplate.opsForHash().get(roomKey, "start").toString());
		response.put("rankRestriction", websocketRedisTemplate.opsForHash().get(roomKey, "rankRestriction").toString());
		response.put("isGameStarted", started);
		response.put("playersInfo", playersInfo);
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId, response);
	}

	private PlayerInfo getPlayerInfo(String roomKey, int userId) {
		String userKey = roomKey + ":user:" + userId;

		Map<Object, Object> playerInfo = websocketRedisTemplate.opsForHash().entries(userKey);
		return PlayerInfo.builder()
			.userId(Integer.parseInt((String)playerInfo.get("userId")))
			.userNickname((String)playerInfo.get("userNickname"))
			.horseName((String)playerInfo.get("horseName"))
			.horseColor((String)playerInfo.get("horseColor"))
			.horseRank((String)playerInfo.get("horseRank"))
			.isRoomOwner(Boolean.parseBoolean((String)playerInfo.get("isRoomOwner")))
			.isReady(Boolean.parseBoolean((String)playerInfo.get("isReady")))
			.hasEnoughCoin(hasUserEnoughCoin(userId, roomKey))
			.build();
	}

	private boolean isAllPlayersReady(String roomKey) {
		List<Object> playerIds = websocketRedisTemplate.opsForList().range(roomKey + ":players", 0, -1);

		for (Object id : playerIds) {
			String userKey = roomKey + ":user:" + id;

			String isRoomOwner = (String)websocketRedisTemplate.opsForHash().get(userKey, "isRoomOwner");

			if ("true".equals(isRoomOwner)) {
				continue;
			}

			Boolean isReady = Boolean.valueOf(
				(String)websocketRedisTemplate.opsForHash().get(userKey, "isReady")
			);

			if (!isReady) {
				return false;
			}
		}
		return true;
	}

	private String getUserNickname(String userKey) {
		return websocketRedisTemplate.opsForHash().get(userKey, "userNickname").toString();
	}

	private void sendSystemMessage(Long roomId, String message) {
		long millis = System.currentTimeMillis();
		LocalTime time = Instant.ofEpochMilli(millis)
			.atZone(ZoneId.systemDefault())
			.toLocalTime();
		ChatMessage chatMessage = new ChatMessage("SYSTEM", message, time);

		messagingTemplate.convertAndSend("/topic/race_room/" + roomId + "/chat", chatMessage);
	}

	private void sendErrorMessage(String sessionId, String errorCode) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
		headerAccessor.setSessionId(sessionId);
		headerAccessor.setLeaveMutable(true);
		RaceRoomError errorResponse = RaceRoomError.builder().errorCode(errorCode).build();

		messagingTemplate.convertAndSendToUser(
			sessionId, "/queue/subscribe", errorResponse, headerAccessor.getMessageHeaders()
		);
	}

	private double calculateDistance(Map<Object, Object> stats, double currentDistance) {
		double speed = Double.parseDouble(stats.getOrDefault("horseSpeed", "0").toString());
		double accel = Double.parseDouble(stats.getOrDefault("horseAcceleration", "0").toString());
		double stamina = Double.parseDouble(stats.getOrDefault("horseStamina", "0").toString());
		double weight = Double.parseDouble(stats.getOrDefault("horseWeight", "0").toString());

		double speedWeight, accelWeight, staminaWeight;
		if (currentDistance <= 625.0) {
			accelWeight = 0.4;
			speedWeight = 0.3;
			staminaWeight = 0.2;
		} else if (currentDistance <= 1275.0) {
			speedWeight = 0.4;
			accelWeight = 0.3;
			staminaWeight = 0.2;
		} else {
			staminaWeight = 0.4;
			speedWeight = 0.3;
			accelWeight = 0.2;
		}

		double baseDistance =
			(speed * speedWeight * 0.5) +
				(accel * accelWeight * 0.5) +
				(stamina * staminaWeight * 0.5) -
				(weight * 0.01);

		return Math.max(0.0, baseDistance);
	}

	private double getPlayerDistance(String userKey) {
		Object distanceObj = websocketRedisTemplate.opsForHash().get(userKey, "distance");
		return (distanceObj != null) ? Double.parseDouble(distanceObj.toString()) : 0.0;
	}

	private void sendRaceProgress(Long roomId, List<PlayerRaceProgress> progress) {
		Map<String, Object> response = new HashMap<>();
		response.put("type", "progressData");
		response.put("progress", progress);
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId + "/game", response);
	}

	private void sendRaceResult(Long roomId, List<GameResult> gameResults) {
		Map<String, Object> response = new HashMap<>();
		String roomKey = RACE_ROOM_PREFIX + roomId;
		response.put("type", "resultData");
		response.put("roomId", roomId);
		response.put("roomName", websocketRedisTemplate.opsForHash().get(roomKey, "roomName").toString());
		response.put("maxPlayers", websocketRedisTemplate.opsForHash().get(roomKey, "maxPlayers").toString());
		response.put("gameResult", gameResults);
		List<Object> playerIds = websocketRedisTemplate.opsForList().range(roomKey + ":players", 0, -1);
		List<PlayerInfo> playersInfo = playerIds.stream()
			.map(id -> getPlayerInfo(roomKey, Integer.parseInt(id.toString())))
			.collect(Collectors.toList());
		response.put("playersInfo", playersInfo);
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId + "/game", response);
	}

	public void changeRepresentativeHorse(Long roomId, int userId, int cardId) {
		cardService.changeRepresentativeCard(userId, cardId);

		String roomKey = RACE_ROOM_PREFIX + roomId;
		String userKey = roomKey + ":user:" + userId;

		CardEntity cardEntity = cardService.findRepresentativeCard(userId);
		HorseEntity horseEntity = horseService.findHorseById(cardEntity.getHorseId());
		websocketRedisTemplate.opsForHash()
			.put(userKey, "cardId", String.valueOf(cardId));
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseId", horseEntity.getId());
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseName", horseEntity.getName());
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseColor", horseEntity.getCoatColor().toLowerCase());
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseRank", horseEntity.getHorseRank().toLowerCase());
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseWeight", String.valueOf(horseEntity.getWeight()));
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseSpeed", String.valueOf(horseEntity.getSpeed()));
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseAcceleration", String.valueOf(horseEntity.getAcceleration()));
		websocketRedisTemplate.opsForHash()
			.put(userKey, "horseStamina", String.valueOf(horseEntity.getStamina()));

		broadcastPlayersInfo(roomId, roomKey);
	}
}
