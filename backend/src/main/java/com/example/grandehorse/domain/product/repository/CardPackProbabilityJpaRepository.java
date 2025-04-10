package com.example.grandehorse.domain.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.product.entity.coin.cardpack.CardPackProbabilityEntity;
import com.example.grandehorse.domain.product.entity.coin.cardpack.CardPackProbabilityId;

public interface CardPackProbabilityJpaRepository
	extends JpaRepository<CardPackProbabilityEntity, CardPackProbabilityId> {
	List<CardPackProbabilityEntity> findById_CardPackId(byte cardPackId);

}
