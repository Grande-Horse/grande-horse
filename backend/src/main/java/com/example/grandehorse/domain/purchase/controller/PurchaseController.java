package com.example.grandehorse.domain.purchase.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.card.controller.response.CardResponseDto;
import com.example.grandehorse.domain.purchase.controller.request.PaymentInfoDto;
import com.example.grandehorse.domain.purchase.controller.request.ProductDto;
import com.example.grandehorse.domain.purchase.controller.response.CashOrderResponse;
import com.example.grandehorse.domain.purchase.service.CashPurchaseService;
import com.example.grandehorse.domain.purchase.service.CoinPurchaseService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {
	private final CashPurchaseService cashPurchaseService;
	private final CoinPurchaseService coinPurchaseService;

	@PostMapping("/coin/cash/init")
	public ResponseEntity<CommonResponse<CashOrderResponse>> createCashOrder(
		@RequestAttribute("userId") int userId,
		@Valid @RequestBody ProductDto productDto
	) {
		return CommonResponse.success(cashPurchaseService.createCashOrder(userId, productDto));
	}

	@PostMapping("/coin/cash/confirm")
	public ResponseEntity<CommonResponse<Void>> confirmCashOrder(
		@RequestAttribute("userId") int userId,
		@RequestBody PaymentInfoDto paymentInfoDto
	) {
		cashPurchaseService.verifyAndSavePayment(userId, paymentInfoDto);
		return CommonResponse.success(null);
	}

	@PostMapping("/cardpack/daily")
	public ResponseEntity<CommonResponse<List<CardResponseDto>>> purchaseDailyCardPack(
		@RequestAttribute("userId") int userId
	) {
		return CommonResponse.success(coinPurchaseService.processDailyCardPackPurchase(userId));
	}

	@PostMapping("/cardpack/coin")
	public ResponseEntity<CommonResponse<List<CardResponseDto>>> purchaseCardPack(
		@RequestAttribute("userId") int userId,
		@Valid @RequestBody ProductDto productDto
	) {
		return CommonResponse.success(coinPurchaseService.processCardPackPurchase(userId, productDto.getId()));
	}
}
