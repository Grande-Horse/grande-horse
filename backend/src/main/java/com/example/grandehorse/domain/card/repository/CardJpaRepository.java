package com.example.grandehorse.domain.card.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.card.entity.CardEntity;

public interface CardJpaRepository extends JpaRepository<CardEntity, Integer> {
	Optional<CardEntity> findByUserIdAndId(int userId, int id);

	Optional<CardEntity> findByIdAndStatus(int id, byte status);
}
