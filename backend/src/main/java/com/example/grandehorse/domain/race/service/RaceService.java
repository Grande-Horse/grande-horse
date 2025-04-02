package com.example.grandehorse.domain.race.service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.horse.entity.HorseEntity;
import com.example.grandehorse.domain.horse.service.HorseService;
import com.example.grandehorse.domain.race.controller.request.CreateRaceRoomDto;
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
		Map<String, Map<String, Object>> raceRooms = getRaceRooms();
		messagingTemplate.convertAndSend("/topic/waiting_rooms", raceRooms);
	}

	public void createRaceRoom(
		CreateRaceRoomDto createRaceRoomDto,
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
			"roomName", createRaceRoomDto.getRoomName(),
			"currentPlayers", 0,
			"maxPlayers", createRaceRoomDto.getMaxPlayers(),
			"rankRestriction", createRaceRoomDto.getRankRestriction(),
			"bettingCoin", createRaceRoomDto.getBettingCoin()
		);
		hashOps.putAll(roomKey, raceRoom);

		String ownerKey = roomKey + ":owner";
		websocketRedisTemplate.opsForValue().set(ownerKey, userId);

		messagingTemplate.convertAndSendToUser(sessionId, "queue/subscribe", roomId);
	}

	public void joinRaceRoom(Long roomId, int userId) {
		String roomKey = RACE_ROOM_PREFIX + roomId;
		CardEntity cardEntity = cardService.findRepresentativeCard(userId);
		HorseEntity horseEntity = horseService.findHorseById(cardEntity.getHorseId());
		String userNickname = userService.findNicknameById(userId);
		Boolean isRoomOwner = isRoomOwner(roomKey, userId);

		String result = executeJoinScript(roomKey, userId, cardEntity, horseEntity, userNickname, isRoomOwner);
		validateJoinResult(result);

		broadcastPlayersInfo(roomId, roomKey);
		broadcastRaceRooms();
	}

	private String executeJoinScript(String roomKey, int userId, CardEntity cardEntity, HorseEntity horseEntity,
		String userNickname, Boolean isRoomOwner) {
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

	private Map<String, Map<String, Object>> getRaceRooms() {
		Set<String> keys = websocketRedisTemplate.keys(RACE_ROOM_PREFIX + "*");

		if (keys.isEmpty()) {
			return Map.of();
		}

		HashOperations<String, String, Object> hashOps = websocketRedisTemplate.opsForHash();
		return keys
			.stream()
			.collect(
				Collectors.toMap(
					key -> key.replace(RACE_ROOM_PREFIX, ""),
					key -> hashOps.entries(key)
				));
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
			+ "local isRoomOwner = ARGV[12] == 'true'\n"
			+ "local maxPlayers = tonumber(redis.call('HGET', roomKey, 'maxPlayers'))\n"
			+ "local currentPlayers = tonumber(redis.call('HGET', roomKey, 'currentPlayers'))\n"
			+ "if not maxPlayers or not currentPlayers then\n"
			+ "    return redis.error_reply('RACE_ROOM_NOT_EXISTED')\n"
			+ "end\n"
			+ "if currentPlayers >= maxPlayers then\n"
			+ "    return redis.error_reply('RACE_ROOM_MAX_PLAYER')\n"
			+ "end\n"
			+ "local userKey = roomKey .. ':user:' .. userId\n"
			+ "redis.call('HSET', userKey, 'cardId', cardId)\n"
			+ "redis.call('HSET', userKey, 'horseId', horseId)\n"
			+ "redis.call('HSET', userKey, 'userNickname', userNickname)\n"
			+ "redis.call('HSET', userKey, 'horseName', horseName)\n"
			+ "redis.call('HSET', userKey, 'horseColor', horseColor)\n"
			+ "redis.call('HSET', userKey, 'horseRank', horseRank)\n"
			+ "redis.call('HSET', userKey, 'horseWeight', horseWeight)\n"
			+ "redis.call('HSET', userKey, 'horseSpeed', horseSpeed)\n"
			+ "redis.call('HSET', userKey, 'horseAcceleration', horseAcceleration)\n"
			+ "redis.call('HSET', userKey, 'horseStamina', horseStamina)\n"
			+ "redis.call('HSET', userKey, 'isRoomOwner', tostring(isRoomOwner))\n"
			+ "redis.call('SADD', roomKey .. ':players', userId)\n"
			+ "redis.call('HINCRBY', roomKey, 'currentPlayers', 1)\n"
			+ "return 1";
	}

	private void validateJoinResult(String result) {
		if ("RACE_ROOM_NOT_EXISTED".equals(result)) {
			throw new RaceException(CustomError.RACE_ROOM_NOT_EXISTED);
		} else if ("RACE_ROOM_MAX_PLAYER".equals(result)) {
			throw new RaceException(CustomError.RACE_ROOM_MAX_PLAYER);
		}
	}

	private void broadcastPlayersInfo(Long roomId, String roomKey) {
		Set<Object> playerIds = websocketRedisTemplate.opsForSet().members(roomKey + ":players");
		List<PlayerInfo> playersInfo = playerIds.stream()
			.map(id -> getPlayerInfo(roomKey, id))
			.collect(Collectors.toList());
		messagingTemplate.convertAndSend("/topic/race_room/" + roomId, playersInfo);
	}

	private PlayerInfo getPlayerInfo(String roomKey, Object id) {
		String userKey = roomKey + ":user:" + id;
		Map<Object, Object> playerInfo = websocketRedisTemplate.opsForHash().entries(userKey);
		return PlayerInfo.builder()
			.userId(Integer.parseInt((String)id))
			.cardId(Integer.parseInt((String)playerInfo.get("cardId")))
			.horseId((String)playerInfo.get("horseId"))
			.userNickname((String)playerInfo.get("userNickname"))
			.horseName((String)playerInfo.get("horseName"))
			.horseColor((String)playerInfo.get("horseColor"))
			.horseRank((String)playerInfo.get("horseRank"))
			.weight(Short.parseShort((String)playerInfo.get("horseWeight")))
			.speed(Double.parseDouble((String)playerInfo.get("horseSpeed")))
			.acceleration(Double.parseDouble((String)playerInfo.get("horseAcceleration")))
			.stamina(Double.parseDouble((String)playerInfo.get("horseStamina")))
			.isRoomOwner(Boolean.parseBoolean((String)playerInfo.get("isRoomOwner")))
			.build();
	}
}
