package com.example.grandehorse.domain.card.repository;

import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.example.grandehorse.domain.card.entity.CardEntity;

public interface CardJpaRepository extends JpaRepository<CardEntity, Integer> {
	boolean existsByUserIdAndId(int userId, int cardId);

	boolean existsByIdAndStatus(int cardId, byte status);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c FROM CardEntity c WHERE c.id = :cardId")
	Optional<CardEntity> findByIdWithPessimisticLock(int cardId);

	Optional<CardEntity> findCardByUserIdAndStatus(int userId, int status);
}
