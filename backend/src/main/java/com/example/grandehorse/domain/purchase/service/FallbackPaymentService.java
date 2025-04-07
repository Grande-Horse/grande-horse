package com.example.grandehorse.domain.purchase.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.product.entity.cash.CashProductEntity;
import com.example.grandehorse.domain.product.service.ProductService;
import com.example.grandehorse.domain.purchase.entity.cash.CashOrderEntity;
import com.example.grandehorse.domain.purchase.entity.cash.CashOrderStatus;
import com.example.grandehorse.domain.purchase.repository.CashOrderJpaRepository;
import com.example.grandehorse.domain.purchase.util.MerchantUidInfo;
import com.example.grandehorse.global.external.payment.client.PortOneClient;
import com.example.grandehorse.global.external.payment.dto.PortOnePaymentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FallbackPaymentService {

	private final CashOrderJpaRepository cashOrderJpaRepository;
	private final ProductService productService;
	private final PortOneClient portOneClient;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void saveFallbackPurchase(PortOnePaymentResponse portOnePayment) {
		MerchantUidInfo orderInfo = MerchantUidInfo.fromRawUid(portOnePayment.getImpUid());

		CashProductEntity cashProduct = productService.gettCashProductById(orderInfo.getProductId());

		CashOrderStatus status =
			portOneClient.cancelPayment(portOnePayment.getImpUid()) ? CashOrderStatus.CANCEL : CashOrderStatus.FAIL;

		CashOrderEntity cashOrderEntity = CashOrderEntity.builder()
			.id(portOnePayment.getImpUid())
			.userId(orderInfo.getUserId())
			.productId(cashProduct.getId())
			.name(cashProduct.getName())
			.price(orderInfo.getPrice())
			.acquiredCoin(cashProduct.getAcquiredCoin())
			.status(status)
			.orderedAt(orderInfo.getTimestamp())
			.build();

		cashOrderJpaRepository.save(cashOrderEntity);
	}
}
