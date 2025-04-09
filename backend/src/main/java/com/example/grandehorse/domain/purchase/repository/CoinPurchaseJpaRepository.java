package com.example.grandehorse.domain.purchase.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.purchase.entity.coin.CoinPurchaseEntity;

public interface CoinPurchaseJpaRepository extends JpaRepository<CoinPurchaseEntity, Integer> {
	Optional<CoinPurchaseEntity> findTopByUserIdAndProductIdOrderByIdDesc(int userId, byte productId);
}
