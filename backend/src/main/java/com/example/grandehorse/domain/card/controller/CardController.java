package com.example.grandehorse.domain.card.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.card.controller.request.CombineRequestDto;
import com.example.grandehorse.domain.card.controller.response.CardRaceRecordResponseDto;
import com.example.grandehorse.domain.card.controller.response.CardResponseDto;
import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/cards")
@RequiredArgsConstructor
public class CardController {
	private final CardService cardService;

	@GetMapping("/candidate")
	public ResponseEntity<CommonResponse<List<CardResponseDto>>> getRaceCards(
		@RequestAttribute("userId") int userId
	) {
		return cardService.getRaceCards(userId);
	}

	@GetMapping
	public ResponseEntity<CommonResponse<List<CardResponseDto>>> getUserCardList(
		@RequestAttribute("userId") int userId,
		@RequestParam(name = "rank", required = false, defaultValue = "ALL") String horseRank,
		@RequestParam(name = "cursorId", required = false, defaultValue = "0") int page,
		@RequestParam(name = "limit", required = false, defaultValue = "12") int limit
	) {
		return cardService.getUserCardList(userId, horseRank, page, limit);
	}

	@GetMapping("/{cardId}/race-record")
	public ResponseEntity<CommonResponse<CardRaceRecordResponseDto>> getCardRaceRecord(
		@PathVariable(name = "cardId") int cardId,
		@RequestAttribute("userId") int userId
	) {
		return cardService.getCardRaceRecord(userId, cardId);
	}

	@PutMapping("/{cardId}/representative")
	public ResponseEntity<CommonResponse<Void>> changeRepresentativeCard(
		@PathVariable(name = "cardId") int cardId,
		@RequestAttribute("userId") int userId
	) {
		return cardService.changeRepresentativeCard(userId, cardId);
	}

	@PutMapping("/{cardId}/candidate")
	public ResponseEntity<CommonResponse<Void>> toggleCandidateStatus(
		@PathVariable(name = "cardId") int cardId,
		@RequestAttribute("userId") int userId
	) {
		cardService.toggleCandidateStatus(userId, cardId);
		return CommonResponse.success(null);
	}

	@PostMapping("/combine")
	public ResponseEntity<CommonResponse<CardResponseDto>> combineCards(
		@RequestBody CombineRequestDto request,
		@RequestAttribute("userId") int userId
	) {
		return cardService.combineCards(userId, request);
	}
}
