package com.example.grandehorse.domain.product.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.product.entity.cash.CashProductEntity;
import com.example.grandehorse.domain.product.entity.coin.CoinProductType;
import com.example.grandehorse.domain.product.entity.coin.ProductEntity;
import com.example.grandehorse.domain.product.entity.coin.cardpack.CardPackEntity;
import com.example.grandehorse.domain.product.entity.coin.cardpack.CardPackProbabilityEntity;
import com.example.grandehorse.domain.product.repository.CardPackJpaRepository;
import com.example.grandehorse.domain.product.repository.CardPackProbabilityJpaRepository;
import com.example.grandehorse.domain.product.repository.CashProductJpaRepository;
import com.example.grandehorse.domain.product.repository.ProductJpaRepository;
import com.example.grandehorse.global.exception.CommonException;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.ProductException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final CashProductJpaRepository cashProductJpaRepository;
	private final ProductJpaRepository productJpaRepository;
	private final CardPackJpaRepository cardPackJpaRepository;
	private final CardPackProbabilityJpaRepository cardPackProbabilityJpaRepository;

	public CashProductEntity getCashProductById(Byte id) {
		return cashProductJpaRepository.findCashProductById(id)
			.orElseThrow(() -> new ProductException(CustomError.PRODUCT_NOT_FOUND));
	}

	public ProductEntity getDailyCardPackProductOnSale() {
		return productJpaRepository.findTopByTypeAndTypeIdAndSellingOrderByIdDesc(
			CoinProductType.CARDPACK,
			(byte)1,
			true
		).orElseThrow(() -> new ProductException(CustomError.PRODUCT_NOT_FOUND));
	}

	public CardPackEntity getCardPackById(Byte id) {
		return cardPackJpaRepository.findById(id)
			.orElseThrow(() -> new ProductException(CustomError.PRODUCT_NOT_FOUND));
	}

	public List<CardPackProbabilityEntity> getRankProbabilitiesByCardPack(CardPackEntity cardPack) {
		List<CardPackProbabilityEntity> probabilities = cardPackProbabilityJpaRepository
			.findById_CardPackId(cardPack.getId());

		if (probabilities.isEmpty()) {
			throw new CommonException(CustomError.CARD_PACK_PROBABILITY_NOT_FOUND);
		}

		probabilities.sort(Comparator.comparingDouble(CardPackProbabilityEntity::getProbability));

		return probabilities;
	}

	public ProductEntity getCardPackProductOnSale(byte id) {
		return productJpaRepository.findTopByTypeAndTypeIdAndSellingOrderByIdDesc(
			CoinProductType.CARDPACK,
			id,
			true
		).orElseThrow(() -> new ProductException(CustomError.PRODUCT_NOT_FOUND));
	}
}
