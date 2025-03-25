package com.example.grandehorse.domain.trading.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.trading.controller.request.CreateCardTradeDto;
import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.service.TradingService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/trading")
@RequiredArgsConstructor
public class TradingController {
	private final TradingService tradingService;

	@PostMapping("")
	public ResponseEntity<CommonResponse<Void>> createCardTrade(
		@Valid @RequestBody CreateCardTradeDto createTradeDto) {
		return tradingService.createCardTrade(createTradeDto);
	}

	@PutMapping("")
	public ResponseEntity<CommonResponse<Void>> purchaseCard(
		@PathVariable(name = "tradeId") int tradeId
	) {
		return tradingService.purchaseCard(tradeId);
	}

	@DeleteMapping("")
	public ResponseEntity<CommonResponse<Void>> cancelCardTrade(
		@PathVariable(name = "tradeId") int tradeId
	) {
		return tradingService.cancelCardTrade(tradeId);
	}

	@GetMapping("/trade-cards")
	public ResponseEntity<CommonResponse<List<TradeCardResponse>>> getTradeCards(
		@RequestParam(name = "cursorId") int cursorId,
		@RequestParam(name = "rank") String rank,
		@RequestParam(name = "search") String search,
		@RequestParam(name = "limit") int limit
	) {
		return tradingService.getTradeCards(cursorId, rank, search, limit);
	}

	@GetMapping("/registered-cards")
	public ResponseEntity<CommonResponse<List<RegisteredCardResponse>>> getRegisteredTradeCards(
		@RequestParam(name = "sellerId") int sellerId,
		@RequestParam(name = "cursorId") int cursorId,
		@RequestParam(name = "rank") String rank,
		@RequestParam(name = "search") String search,
		@RequestParam(name = "limit") int limit
	) {
		return tradingService.getRegisteredCards(sellerId, cursorId, rank, search, limit);
	}
}
