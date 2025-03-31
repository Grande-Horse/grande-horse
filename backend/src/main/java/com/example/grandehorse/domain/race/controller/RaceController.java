package com.example.grandehorse.domain.race.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.race.controller.request.CreateRaceRoomDto;
import com.example.grandehorse.domain.race.controller.response.RacePlayerDetailsResponse;
import com.example.grandehorse.global.response.CommonResponse;
import com.example.grandehorse.domain.race.service.RaceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/races")
@RequiredArgsConstructor
public class RaceController {
	private final RaceService raceService;

	@PostMapping("")
	public ResponseEntity<CommonResponse<String>> createRaceRoom(
		@RequestBody CreateRaceRoomDto createRaceRoomDto,
		@RequestParam("userId") int userId
	) {
		raceService.createRaceRoom(createRaceRoomDto, userId);
		return CommonResponse.success("방이 성공적으로 생성되었습니다.");
	}

	@PostMapping("/join/{roomId}")
	public ResponseEntity<CommonResponse<String>> joinRaceRoom(
		@PathVariable("roomId") String roomId,
		@RequestAttribute("userId") int userId
	) {
		raceService.joinRaceRoom(roomId, userId);
		return CommonResponse.success("방 참가에 성공했습니다.");
	}

	@GetMapping("")
	public ResponseEntity<CommonResponse<Map<String, Map<Object, Object>>>> getRaceRooms() {
		Map<String, Map<Object, Object>> gameRooms = raceService.getAllRaceRooms();
		return CommonResponse.success(gameRooms);
	}

	@GetMapping("{roomId}")
	public ResponseEntity<CommonResponse<List<RacePlayerDetailsResponse>>> getRacePlayersDetails(
		@PathVariable("roomId") String roomId
	) {
		List<RacePlayerDetailsResponse> playersDetails = raceService.getRacePlayersDetails(roomId);
		return CommonResponse.listSuccess(playersDetails);
	}
}
