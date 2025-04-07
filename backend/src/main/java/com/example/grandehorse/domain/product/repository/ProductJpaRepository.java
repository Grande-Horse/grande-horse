package com.example.grandehorse.domain.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.product.entity.coin.CoinProductType;
import com.example.grandehorse.domain.product.entity.coin.ProductEntity;

public interface ProductJpaRepository extends JpaRepository<ProductEntity, Integer> {
	Optional<ProductEntity> findTopByTypeAndTypeIdAndSellingOrderByIdDesc(
		CoinProductType type,
		byte typeId,
		boolean selling
	);
}
