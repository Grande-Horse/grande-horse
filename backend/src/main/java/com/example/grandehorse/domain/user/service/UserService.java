package com.example.grandehorse.domain.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.user.entity.Coin;
import com.example.grandehorse.domain.user.entity.UserEntity;
import com.example.grandehorse.domain.user.repository.UserJpaRepository;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.UserException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserJpaRepository userJpaRepository;

	@Transactional
	public void purchaseCard(int buyerId, int sellerId, int price) {
		deductCoinForPurchase(buyerId, price);
		addSaleEarningsToCoins(sellerId, price);
	}

	private void deductCoinForPurchase(int buyerId, int price) {
		UserEntity user = userJpaRepository.findByIdWithPessimisticLock(buyerId)
			.orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));

		user.validateCoin(price);
		user.decreaseCoin(price);
		userJpaRepository.save(user);
	}

	private void addSaleEarningsToCoins(int sellerId, int price) {
		UserEntity user = userJpaRepository.findByIdWithPessimisticLock(sellerId)
			.orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));

		user.increaseCoin(price);
		userJpaRepository.save(user);
	}
}
