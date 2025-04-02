package com.example.grandehorse.domain.race.controller;

import java.util.Map;

import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.race.controller.request.CreateRaceRoomDto;
import com.example.grandehorse.domain.race.controller.request.JoinRaceRoomDto;
import com.example.grandehorse.domain.race.service.RaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RaceController {
	private final RaceService raceService;

	@SubscribeMapping("/waiting_rooms")
	public void broadcastRaceRooms() {
		raceService.broadcastRaceRooms();
	}

	@MessageMapping("/createRoom")
	public void createRaceRoom(
		CreateRaceRoomDto createRaceRoomDto,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes,
		@Header("simpSessionId") String sessionId
	) {
		int userId = (int)sessionAttributes.get("userId");
		raceService.createRaceRoom(createRaceRoomDto, userId, sessionId);
	}

	@MessageMapping("/joinRoom")
	public void joinRaceRoom(
		JoinRaceRoomDto joinRaceRoomDto,
		@Header("simpSessionAttributes") Map<String, Object> sessionAttributes
	) {
		int userId = (int)sessionAttributes.get("userId");
		raceService.joinRaceRoom(joinRaceRoomDto.getRoomId(), userId);
	}
}
