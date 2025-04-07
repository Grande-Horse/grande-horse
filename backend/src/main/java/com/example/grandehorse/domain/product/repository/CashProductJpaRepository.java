package com.example.grandehorse.domain.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.product.entity.cash.CashProductEntity;

public interface CashProductJpaRepository extends JpaRepository<CashProductEntity, Byte> {
	Optional<CashProductEntity> findCashProductById(Byte id);
}
