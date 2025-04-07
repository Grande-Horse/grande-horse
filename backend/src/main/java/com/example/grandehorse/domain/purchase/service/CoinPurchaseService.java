package com.example.grandehorse.domain.purchase.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.card.controller.response.CardResponseDto;
import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.product.entity.coin.ProductEntity;
import com.example.grandehorse.domain.product.entity.coin.cardpack.CardPackEntity;
import com.example.grandehorse.domain.product.service.ProductService;
import com.example.grandehorse.domain.purchase.entity.coin.CoinPurchaseEntity;
import com.example.grandehorse.domain.purchase.repository.CoinPurchaseJpaRepository;
import com.example.grandehorse.domain.user.entity.UserEntity;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.exception.CommonException;
import com.example.grandehorse.global.exception.CustomError;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoinPurchaseService {
	private final CoinPurchaseJpaRepository coinPurchaseJpaRepository;
	private final UserService userService;
	private final ProductService productService;
	private final CardService cardService;

	@Transactional
	public List<CardResponseDto> processDailyCardPackPurchase(int userId) {
		UserEntity user = userService.findUserById(userId);

		ProductEntity product = productService.getDailyCardPackProductOnSale();

		Optional<CoinPurchaseEntity> latestPurchase =
			coinPurchaseJpaRepository.findTopByUserIdAndProductIdOrderByIdDesc(userId, (byte)product.getId());

		validateDailyCardPackPurchase(latestPurchase);

		CardPackEntity cardPack = productService.getCardPackById(product.getTypeId());

		LocalDateTime purchasedTime = LocalDateTime.now();

		saveCoinPurchaseHistory(userId, cardPack.getId(), cardPack.getName(), product.getPrice(), purchasedTime);

		return cardService.drawCardListFromCardPack(userId, cardPack, purchasedTime);
	}

	private void validateDailyCardPackPurchase(Optional<CoinPurchaseEntity> latestPurchase) {
		boolean canPurchase = latestPurchase.map(
				purchase -> purchase.getPurchasedAt()
					.toLocalDate().isBefore(LocalDateTime.now().toLocalDate()))
			.orElse(true);

		if (!canPurchase) {
			throw new CommonException(CustomError.ALREADY_PURCHASED_TODAY);
		}
	}

	public CoinPurchaseEntity saveCoinPurchaseHistory(int userId, byte productId, String name, int price,
		LocalDateTime purchasedTime) {
		CoinPurchaseEntity coinPurchaseEntity = CoinPurchaseEntity.builder()
			.userId(userId)
			.productId(productId)
			.name(name)
			.price(price)
			.purchasedAt(purchasedTime)
			.build();
		return coinPurchaseJpaRepository.save(coinPurchaseEntity);
	}

	@Transactional
	public List<CardResponseDto> processCardPackPurchase(int userId, byte productId) {
		ProductEntity product = productService.getCardPackProductOnSale(productId);

		userService.decreaseUserCoin(userId, product.getPrice());

		CardPackEntity cardPack = productService.getCardPackById(product.getTypeId());

		LocalDateTime purchasedTime = LocalDateTime.now();

		saveCoinPurchaseHistory(userId, cardPack.getId(), cardPack.getName(), product.getPrice(), purchasedTime);

		return cardService.drawCardListFromCardPack(userId, cardPack, purchasedTime);
	}
}
