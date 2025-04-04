package com.example.grandehorse.domain.purchase.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.product.controller.request.CashProductDto;
import com.example.grandehorse.domain.product.controller.request.PaymentInfoDto;
import com.example.grandehorse.domain.product.controller.response.CashOrderResponse;
import com.example.grandehorse.domain.purchase.service.PurchaseService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {
	private final PurchaseService purchaseService;

	@PostMapping("/coin/cash/init")
	public ResponseEntity<CommonResponse<CashOrderResponse>> createCashOrder(
		@RequestAttribute("userId") int userId,
		@Valid @RequestBody CashProductDto cashProductDto
	) {
		return CommonResponse.success(purchaseService.createCashOrder(userId, cashProductDto));
	}

	@PostMapping("/coin/cash/confirm")
	public ResponseEntity<CommonResponse<Void>> confirmCashOrder(
		@RequestAttribute("userId") int userId,
		@RequestBody PaymentInfoDto paymentInfoDto
	) {
		purchaseService.verifyAndSavePayment(userId, paymentInfoDto);
		return CommonResponse.success(null);
	}
}
