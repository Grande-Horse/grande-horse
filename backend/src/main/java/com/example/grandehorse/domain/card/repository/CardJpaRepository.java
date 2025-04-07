package com.example.grandehorse.domain.card.repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.grandehorse.domain.card.controller.response.CardResponseDto;
import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.horse.entity.HorseRank;

public interface CardJpaRepository extends JpaRepository<CardEntity, Integer> {
	boolean existsByUserIdAndId(int userId, int cardId);

	boolean existsByIdAndStatus(int cardId, byte status);

	Optional<CardEntity> findByIdAndUserId(int userId, int cardId);

	int countByUserIdAndStatusIn(int userId, List<Byte> statuses);

	@Query("""
			SELECT new com.example.grandehorse.domain.card.controller.response.CardResponseDto(
				c.id,
				c.horseId,
				c.status,
				h.coatColor,
				h.name,
				h.horseRank,
				h.weight,
				h.speed,
				h.acceleration,
				h.stamina
			)
			FROM CardEntity c
			JOIN HorseEntity h ON c.horseId = h.id
			WHERE c.userId = :userId
			AND c.status IN :statuses
		""")
	List<CardResponseDto> findRaceCards(
		@Param("userId") int userId,
		@Param("statuses") List<Byte> statuses
	);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c FROM CardEntity c WHERE c.id = :cardId")
	Optional<CardEntity> findCardByIdWithPessimisticLock(int cardId);

	@Query("""
			SELECT new com.example.grandehorse.domain.card.controller.response.CardResponseDto(
				c.id,
				c.horseId,
				c.status,
				h.coatColor,
				h.name,
				h.horseRank,
				h.weight,
				h.speed,
				h.acceleration,
				h.stamina
			)
			FROM CardEntity c
			JOIN HorseEntity h ON c.horseId = h.id
			WHERE c.userId = :userId
				AND c.id > :cursorId
				AND (:horseRank IS NULL OR h.horseRank = :horseRank)
				AND c.deletedAt IS NULL
			ORDER BY
				CASE h.horseRank
					WHEN com.example.grandehorse.domain.horse.entity.HorseRank.LEGEND THEN 1
					WHEN com.example.grandehorse.domain.horse.entity.HorseRank.UNIQUE THEN 2
					WHEN com.example.grandehorse.domain.horse.entity.HorseRank.EPIC THEN 3
					WHEN com.example.grandehorse.domain.horse.entity.HorseRank.RARE THEN 4
					WHEN com.example.grandehorse.domain.horse.entity.HorseRank.NORMAL THEN 5
				END, c.id
		""")
	Slice<CardResponseDto> findUserCardsByCursor(
		@Param("userId") int userId,
		@Param("horseRank") HorseRank horseRank,
		@Param("cursorId") int cursorId,
		Pageable pageable
	);

	Optional<CardEntity> findByUserIdAndStatus(int userId, byte status);

	List<CardEntity> findAllByIdInAndUserIdAndStatusAndDeletedAtIsNull(List<Integer> cardIds, int userId, byte status);

	Optional<CardEntity> findCardByUserIdAndStatus(int userId, int status);

	@Query("SELECT c.horseId FROM CardEntity c WHERE c.id = :id")
	Optional<String> findHorseIdById(int id);

	boolean existsByUserIdAndStatus(int userId, byte status);
}
