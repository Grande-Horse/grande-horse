package com.example.grandehorse.domain.purchase.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.product.entity.cash.CashProductEntity;
import com.example.grandehorse.domain.product.service.ProductService;
import com.example.grandehorse.domain.purchase.controller.request.PaymentInfoDto;
import com.example.grandehorse.domain.purchase.controller.request.ProductDto;
import com.example.grandehorse.domain.purchase.controller.response.CashOrderResponse;
import com.example.grandehorse.domain.purchase.entity.cash.CashOrderEntity;
import com.example.grandehorse.domain.purchase.entity.cash.CashOrderStatus;
import com.example.grandehorse.domain.purchase.entity.cash.CashPurchaseEntity;
import com.example.grandehorse.domain.purchase.repository.CashOrderJpaRepository;
import com.example.grandehorse.domain.purchase.repository.CashPurchaseJpaRepository;
import com.example.grandehorse.domain.purchase.util.MerchantUidInfo;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.PurchaseException;
import com.example.grandehorse.global.external.payment.client.PortOneClient;
import com.example.grandehorse.global.external.payment.dto.PortOnePaymentResponse;
import com.example.grandehorse.global.redis.dto.CashOrderRedisDto;
import com.example.grandehorse.global.redis.service.CashOrderRedisService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CashPurchaseService {
	private final CashOrderRedisService cashOrderRedisService;
	private final PortOneClient portOneClient;
	private final ProductService productService;
	private final CashOrderJpaRepository cashOrderJpaRepository;
	private final CashPurchaseJpaRepository cashPurchaseJpaRepository;
	private final UserService userService;
	private final FallbackPaymentService fallbackPaymentService;

	public CashOrderResponse createCashOrder(int userId, ProductDto productDto) {
		CashProductEntity cashProduct = productService.getCashProductById(productDto.getId());

		cashProduct.validateSelling();

		MerchantUidInfo merchantUidInfo = new MerchantUidInfo(cashProduct.getId(), cashProduct.getPrice(), userId);

		String merchantUid = merchantUidInfo.toString();

		CashOrderRedisDto cashOrderRedisDto = CashOrderRedisDto.builder()
			.userId(userId)
			.productId(productDto.getId())
			.name(cashProduct.getName())
			.price(cashProduct.getPrice())
			.acquiredCoin(cashProduct.getAcquiredCoin())
			.orderedAt(merchantUidInfo.getTimestamp())
			.build();

		cashOrderRedisService.save(merchantUid, cashOrderRedisDto);

		return CashOrderResponse.fromCashOrderRedisDto(merchantUid, cashOrderRedisDto);
	}

	@Transactional
	public void verifyAndSavePayment(int userId, PaymentInfoDto paymentInfoDto) {
		String impUid = paymentInfoDto.getImpUid();
		String merchantUid = paymentInfoDto.getMerchantUid();

		PortOnePaymentResponse portOnePayment = portOneClient.getPortOnePayment(impUid);

		if (!portOnePayment.isPaid()) {
			throw new PurchaseException(CustomError.INVALID_PAYMENT);
		}

		CashOrderRedisDto cashOrderRedisDto = cashOrderRedisService.find(merchantUid).orElseThrow(() -> {
			fallbackPaymentService.saveFallbackPurchase(portOnePayment);
			return new PurchaseException(CustomError.EXPIRED_PURCHASE_REQUEST);
		});

		if (!validatePaymentMatch(userId, portOnePayment, cashOrderRedisDto)) {
			fallbackPaymentService.saveFallbackPurchase(portOnePayment);
			throw new PurchaseException(CustomError.INVALID_PAYMENT_AMOUNT);
		}

		saveConfirmedPayment(portOnePayment, cashOrderRedisDto);
	}

	private void saveConfirmedPayment(PortOnePaymentResponse payment, CashOrderRedisDto order) {
		CashOrderEntity cashOrderEntity = CashOrderEntity.builder()
			.id(payment.getImpUid())
			.userId(order.getUserId())
			.productId(order.getProductId())
			.name(order.getName())
			.price(order.getPrice())
			.acquiredCoin(order.getAcquiredCoin())
			.status(CashOrderStatus.SUCCESS)
			.orderedAt(order.getOrderedAt())
			.build();
		cashOrderJpaRepository.save(cashOrderEntity);

		CashPurchaseEntity cashPurchaseEntity = CashPurchaseEntity.builder()
			.cashOrderId(payment.getImpUid())
			.userId(order.getUserId())
			.name(order.getName())
			.price(order.getPrice())
			.acquiredCoin(order.getAcquiredCoin())
			.purchasedAt(LocalDateTime.now())
			.build();
		cashPurchaseJpaRepository.save(cashPurchaseEntity);

		userService.increaseUserCoin(order.getUserId(), order.getPrice());
	}

	private boolean validatePaymentMatch(int userId, PortOnePaymentResponse payment, CashOrderRedisDto order) {
		MerchantUidInfo orderInfo = MerchantUidInfo.fromRawUid(payment.getMerchantUid());
		return orderInfo.getUserId() == userId && payment.getAmount() == order.getPrice()
			&& orderInfo.getProductId() != null && orderInfo.getProductId().equals(order.getProductId());
	}
}
