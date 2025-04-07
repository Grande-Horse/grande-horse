package com.example.grandehorse.domain.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.product.entity.coin.cardpack.CardPackEntity;

public interface CardPackJpaRepository extends JpaRepository<CardPackEntity, Byte> {
	Optional<CardPackEntity> findById(Byte id);
}
