package com.example.grandehorse.domain.trading.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.trading.controller.request.CreateCardTradeDto;
import com.example.grandehorse.domain.trading.controller.response.PriceHistoryResponse;
import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.SoldCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.service.TradingService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tradings")
@RequiredArgsConstructor
public class TradingController {
	private final TradingService tradingService;

	@PostMapping("")
	public ResponseEntity<CommonResponse<Void>> createCardTrade(
		@Valid @RequestBody CreateCardTradeDto createTradeDto,
		@RequestAttribute("userId") int userId
	) {
		return tradingService.createCardTrade(createTradeDto, userId);
	}

	@PutMapping("/{tradeId}")
	public ResponseEntity<CommonResponse<Void>> purchaseCard(
		@PathVariable(name = "tradeId") int tradeId,
		@RequestAttribute("userId") int userId
	) {
		return tradingService.purchaseCard(tradeId, userId);
	}

	@DeleteMapping("/{tradeId}")
	public ResponseEntity<CommonResponse<Void>> cancelCardTrade(
		@PathVariable(name = "tradeId") int tradeId,
		@RequestAttribute("userId") int userId
	) {
		return tradingService.cancelCardTrade(tradeId, userId);
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
	public ResponseEntity<CommonResponse<List<RegisteredCardResponse>>> getRegisteredCards(
		@RequestAttribute("userId") int userId,
		@RequestParam(name = "cursorId") int cursorId,
		@RequestParam(name = "limit") int limit
	) {
		return tradingService.getRegisteredCards(userId, cursorId, limit);
	}

	@GetMapping("/{horseId}/sold-cards")
	public ResponseEntity<CommonResponse<List<SoldCardResponse>>> getSoldCards(
		@PathVariable(name = "horseId") String horseId,
		@RequestParam(name = "cursorId") int cursorId,
		@RequestParam(name = "limit") int limit
	) {
		return tradingService.getSoldCards(horseId, cursorId, limit);
	}

	@GetMapping("{horseId}/price-history")
	public ResponseEntity<CommonResponse<List<PriceHistoryResponse>>> getPriceHistory(
		@PathVariable(name = "horseId") String horseId
	) {
		return tradingService.getPriceHistory(horseId);
	}
}