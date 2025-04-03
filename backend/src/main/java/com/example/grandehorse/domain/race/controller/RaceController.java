package com.example.grandehorse.domain.race.controller;

import java.util.Map;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.race.controller.request.CreateRaceRoomRequest;
import com.example.grandehorse.domain.race.service.RaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RaceController {
	private final RaceService raceService;

	/**
	 * 대기방 목록을 갱신하여 모든 구독자에게 전송하는 메서드
	 * 새로운 방이 생성되거나 변경될 때마다 호출
	 */
	@SubscribeMapping("/waiting_rooms")
	public void broadcastRaceRooms() {
		raceService.broadcastRaceRooms();
	}

	/**
	 * 새로운 레이스 방을 생성하는 메서드
	 */
	@MessageMapping("/createRoom")
	public void createRaceRoom(
		@Payload CreateRaceRoomRequest request,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes,
		@Header("simpSessionId") String sessionId
	) {
		int userId = (int)sessionAttributes.get("userId");
		raceService.createRaceRoom(request, userId, sessionId);
	}

	/**
	 * 사용자가 레이스 방에 참가하는 메서드
	 */
	@MessageMapping("/race_room/{roomId}/join")
	public void joinRaceRoom(
		@DestinationVariable Long roomId,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes
	) {
		int userId = (int) sessionAttributes.get("userId");
		raceService.joinRaceRoom(roomId, userId);
	}

	/**
	 * 플레이어 준비 상태 토글 메서드
	 */
	@MessageMapping("/race_room/{roomId}/ready")
	public void toggleReadyStatus(
		@DestinationVariable Long roomId,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes
	) {
		int userId = (int) sessionAttributes.get("userId");
		raceService.toggleReadyStatus(roomId, userId);
	}

	/**
	 * 레이스 시작 메서드
	 * 방장만 호출할 수 있음
	 */
	@MessageMapping("/race_room/{roomId}/start")
	public void startRace(
		@DestinationVariable Long roomId,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes
	) {
		int userId = (int) sessionAttributes.get("userId");
		raceService.startRace(roomId, userId);
	}

	/**
	 * 사용자가 레이스 방에서 나가는 메서드
	 */
	@MessageMapping("/race_room/{roomId}/leave")
	public void leaveRaceRoom(
		@DestinationVariable Long roomId,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes
	) {
		int userId = (int) sessionAttributes.get("userId");
		raceService.leaveRaceRoom(roomId, userId);
	}

	@MessageMapping("/race_room/{roomId}/chat")
	public void sendChatMessage(
		@DestinationVariable Long roomId,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes,
		@Payload String message
	) {
		int userId = (int) sessionAttributes.get("userId");
		raceService.sendChatMessage(roomId, userId, message);
	}
}
