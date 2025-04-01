package com.example.grandehorse.domain.race.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import com.example.grandehorse.domain.race.controller.response.RacePlayerDetailsResponse;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.RaceException;

@Service
public class RaceService {
	private static final String GAME_ROOM_PREFIX = "game_room:";

	private final RedisTemplate<String, Object> redisTemplate;
	private final SimpMessagingTemplate messagingTemplate;

	private final CardService cardService;
	private final HorseService horseService;
	private final UserService userService;

	public RaceService(
		@Qualifier("websocketRedisTemplate") RedisTemplate<String, Object> redisTemplate,
		SimpMessagingTemplate messagingTemplate,
		CardService cardService,
		HorseService horseService,
		UserService userService
	) {
		this.redisTemplate = redisTemplate;
		this.messagingTemplate = messagingTemplate;
		this.cardService = cardService;
		this.horseService = horseService;
		this.userService = userService;
	}

	public void createRaceRoom(CreateRaceRoomDto createRaceRoomDto, int userId) {
		String roomId = redisTemplate.opsForValue().increment("roomIdCounter", 1).toString();
		String roomKey = GAME_ROOM_PREFIX + roomId;

		if (redisTemplate.hasKey(roomKey)) {
			throw new RaceException(CustomError.RACE_ROOM_IS_ALREADY_EXISTED);
		}

		HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();
		Map<Object, Object> raceRoom = Map.of(
			"roomName", createRaceRoomDto.getRoomName(),
			"currentPlayers", 0,
			"maxPlayers", createRaceRoomDto.getMaxPlayers(),
			"rankRestriction", createRaceRoomDto.getRankRestriction(),
			"bettingCoin", createRaceRoomDto.getBettingCoin()
		);
		hashOps.putAll(roomKey, raceRoom);

		String ownerKey = roomKey + ":owner";
		redisTemplate.opsForValue().set(ownerKey, String.valueOf(userId));

		joinRaceRoom(roomId, userId);
	}

	public void joinRaceRoom(String roomId, int userId) {
		CardEntity cardEntity = cardService.findRepresentativeCard(userId);
		HorseEntity horseEntity = horseService.findHorseById(cardEntity.getHorseId());
		String userNickname = userService.findNicknameById(userId);
		Boolean isRoomOwner = isRoomOwner(roomId, userId);

		String roomKey = GAME_ROOM_PREFIX + roomId;

		String script =
			"local roomKey = KEYS[1]\n" +
				"local userId = tonumber(ARGV[1])\n" +
				"local cardId = tonumber(ARGV[2])\n" +
				"local horseId = ARGV[3]\n" +
				"local horseName = ARGV[4]\n" +
				"local horseColor = ARGV[5]\n" +
				"local horseRank = ARGV[6]\n" +
				"local horseWeight = tonumber(ARGV[7])\n" +
				"local horseSpeed = tonumber(ARGV[8])\n" +
				"local horseAcceleration = tonumber(ARGV[9])\n" +
				"local horseStamina = tonumber(ARGV[10])\n" +
				"local userNickname = ARGV[11]\n" +
				"local isRoomOwner = ARGV[12] == 'true'\n" +

				"-- 방이 존재하지 않으면\n" +
				"local maxPlayers = tonumber(redis.call('HGET', roomKey, 'maxPlayers'))\n" +
				"local currentPlayers = tonumber(redis.call('HGET', roomKey, 'currentPlayers'))\n" +
				"if not maxPlayers or not currentPlayers then\n" +
				"    return redis.error_reply('RACE_ROOM_NOT_EXISTED')\n" +
				"end\n" +

				"-- 최대 인원 수를 초과하면\n" +
				"if currentPlayers >= maxPlayers then\n" +
				"    return redis.error_reply('RACE_ROOM_MAX_PLAYER')\n" +
				"end\n" +

				"-- 유저 정보 저장\n" +
				"local userCardKey = roomKey .. ':user:' .. userId\n" +
				"redis.call('HSET', userCardKey, 'cardId', cardId)\n" +
				"redis.call('HSET', userCardKey, 'horseId', horseId)\n" +
				"redis.call('HSET', userCardKey, 'userNickname', userNickname)\n" +
				"redis.call('HSET', userCardKey, 'horseName', horseName)\n" +
				"redis.call('HSET', userCardKey, 'horseColor', horseColor)\n" +
				"redis.call('HSET', userCardKey, 'horseRank', horseRank)\n" +
				"redis.call('HSET', userCardKey, 'horseWeight', horseWeight)\n" +
				"redis.call('HSET', userCardKey, 'horseSpeed', horseSpeed)\n" +
				"redis.call('HSET', userCardKey, 'horseAcceleration', horseAcceleration)\n" +
				"redis.call('HSET', userCardKey, 'horseStamina', horseStamina)\n" +
				"redis.call('HSET', userCardKey, 'isRoomOwner, isRoomOwner)\n" +

				"-- 유저 방에 추가\n" +
				"local playerKey = 'player:' .. userId\n" +
				"redis.call('HSET', roomKey, playerKey, userId)\n" +

				"-- 현재 인원 수 증가\n" +
				"redis.call('HSET', roomKey, 'currentPlayers', currentPlayers + 1)\n" +

				"return 1";

		RedisScript<String> redisScript = RedisScript.of(script, String.class);

		String result = redisTemplate.execute(
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

		if ("RACE_ROOM_NOT_EXISTED".equals(result)) {
			throw new RaceException(CustomError.RACE_ROOM_NOT_EXISTED);
		} else if ("RACE_ROOM_MAX_PLAYER".equals(result)) {
			throw new RaceException(CustomError.RACE_ROOM_MAX_PLAYER);
		}

		notifyRaceRoomsChange();
		notifyRoomMessage(roomId, userNickname + "님이 방에 입장하셨습니다.");
	}

	private Boolean isRoomOwner(String roomId, int userId) {
		String roomKey = GAME_ROOM_PREFIX + roomId;
		String ownerKey = roomKey + ":owner";

		String ownerId = (String)redisTemplate.opsForValue().get(ownerKey);

		return ownerId != null && ownerId.equals(String.valueOf(userId));
	}

	public Map<String, Map<Object, Object>> getAllRaceRooms() {
		Set<String> keys = redisTemplate.keys(GAME_ROOM_PREFIX + "*");
		if (keys == null || keys.isEmpty()) {
			return Map.of();
		}

		HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();
		return keys.stream().collect(Collectors.toMap(
			key -> key.replace(GAME_ROOM_PREFIX, ""),
			key -> hashOps.entries(key)
		));
	}

	public List<RacePlayerDetailsResponse> getRacePlayersDetails(String roomId) {
		String roomKey = GAME_ROOM_PREFIX + roomId;
		Map<Object, Object> roomData = redisTemplate.opsForHash().entries(roomKey);
		List<RacePlayerDetailsResponse> playersDetails = new ArrayList<>();

		for (Map.Entry<Object, Object> entry : roomData.entrySet()) {
			String key = entry.getKey().toString();
			int userId = Integer.parseInt(key.split(":")[1]);

			Map<String, String> representativeCardDetails = getRepresentativeCardDetails(roomKey, userId);

			RacePlayerDetailsResponse racePlayerDetails = createRacePlayerDetails(representativeCardDetails);

			playersDetails.add(racePlayerDetails);
		}

		return playersDetails;
	}

	private void notifyRaceRoomsChange() {
		Map<String, Map<Object, Object>> raceRooms = getAllRaceRooms();
		messagingTemplate.convertAndSend("/topic/waiting-room", raceRooms);
	}

	public void notifyRoomMessage(String roomId, String message) {
		messagingTemplate.convertAndSend("/topic/room/" + roomId, message);
	}

	private Map<String, String> getRepresentativeCardDetails(String roomKey, int userId) {
		String userCardKey = roomKey + ":user:" + userId + ":card";

		return redisTemplate.opsForHash().entries(userCardKey)
			.entrySet().stream()
			.collect(Collectors.toMap(
				e -> e.getKey().toString(),
				e -> e.getValue().toString()
			));
	}

	private RacePlayerDetailsResponse createRacePlayerDetails(
		Map<String, String> representativeCardDetails
	) {
		return RacePlayerDetailsResponse.builder()
			.cardId(safeParseInt(representativeCardDetails.get("cardId")))
			.horseId(representativeCardDetails.get("horseId"))
			.horseName(representativeCardDetails.get("horseName"))
			.horseColor(representativeCardDetails.get("horseColor"))
			.horseRank(representativeCardDetails.get("horseRank"))
			.horseWeight(safeParseDouble(representativeCardDetails.get("horseWeight")))
			.horseSpeed(safeParseDouble(representativeCardDetails.get("horseSpeed")))
			.horseAcceleration(safeParseDouble(representativeCardDetails.get("horseAcceleration")))
			.horseStamina(safeParseDouble(representativeCardDetails.get("horseStamina")))
			.isRoomOwner(Boolean.parseBoolean(representativeCardDetails.get("isRoomOwner")))
			.build();
	}

	private int safeParseInt(String value) {
		return Optional.ofNullable(value)
			.map(v -> {
				try {
					return Integer.parseInt(v);
				} catch (NumberFormatException e) {
					return 0;
				}
			})
			.orElse(0);
	}

	private double safeParseDouble(String value) {
		return Optional.ofNullable(value)
			.map(v -> {
				try {
					return Double.parseDouble(v);
				} catch (NumberFormatException e) {
					return 0.0;
				}
			})
			.orElse(0.0);
	}
}
