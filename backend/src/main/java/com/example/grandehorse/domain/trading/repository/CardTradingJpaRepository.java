package com.example.grandehorse.domain.trading.repository;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.LockModeType;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.horse.entity.HorseRank;
import com.example.grandehorse.domain.trading.controller.response.PriceHistoryResponse;
import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.SoldCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.entity.CardTradeEntity;
import com.example.grandehorse.domain.trading.entity.CardTradeStatus;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface CardTradingJpaRepository extends JpaRepository<CardTradeEntity, Integer> {
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT c FROM CardTradeEntity c WHERE c.id = :id")
	CardTradeEntity findCardTradeByIdWithPessimisticLock(@Param("id") int id);

	boolean existsByIdAndStatus(int id, CardTradeStatus status);

	/* TODO
		   검색 기능 ngram 사용하여 최적화 시키기
		   JPA N+1 문제 확인하기
	 */
	@Query("""
		         SELECT new com.example.grandehorse.domain.trading.controller.response.TradeCardResponse(
		             t.id,
		             h.id,
		             h.coatColor,
		             h.name,
		             h.horseRank,
		             t.price,
		             h.speed,
		             h.acceleration,
		             h.stamina,
		             t.registeredAt
		         )
		         FROM CardTradeEntity t
		         JOIN HorseEntity h ON t.horseId = h.id
		         WHERE t.status = 'REGISTERED'
		         AND t.id > :cursorId
		         AND (:horseRank IS NULL OR h.horseRank = :horseRank)
		         AND (:search IS NULL OR h.name LIKE CONCAT('%', :search, '%'))
		AND (:sellerId IS NULL OR t.sellerId != :sellerId)
		         ORDER BY t.id ASC
		""")
	Slice<TradeCardResponse> findTradeCardsByCursor(
		@Param("cursorId") int cursorId,
		@Param("horseRank") HorseRank horseRank,
		@Param("search") String search,
		@Param("sellerId") int sellerId,
		Pageable pageable
	);

	/* TODO
		   검색 기능 ngram 사용하여 최적화 시키기
		   JPA N+1 문제 확인하기
	 */
	@Query(value = """
		    SELECT new com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse(
		        t.id,
		        h.id,
		        h.coatColor,
		        h.name,
		        h.horseRank,
		        t.price,
		        h.speed,
		        h.acceleration,
		        h.stamina,
		        t.registeredAt
		    )
		    FROM CardTradeEntity t
		    JOIN HorseEntity h ON h.id = t.horseId
		    WHERE t.status = 'REGISTERED'
		    AND t.sellerId = :sellerId
		    AND t.id > :cursorId
		    ORDER BY t.id ASC
		""")
	Slice<RegisteredCardResponse> findRegisteredCardsByCursor(
		@Param("sellerId") int sellerId,
		@Param("cursorId") int cursorId,
		Pageable pageable
	);

	@Query("""
		    SELECT new com.example.grandehorse.domain.trading.controller.response.SoldCardResponse(
		        t.id,
		        h.id,
		        h.coatColor,
		        h.name,
		        h.horseRank,
		        t.price,
		        d.speed,
		        d.acceleration,
		        d.stamina,
		        t.soldAt
		    )
		    FROM CardTradeEntity t
		    JOIN HorseEntity h ON h.id = t.horseId
		    JOIN HorseDataEntity d ON d.id = t.horseDataId
		    WHERE t.horseId = :horseId
		    AND t.status = 'SOLD'
		    AND t.id > :cursorId
		    ORDER BY t.id ASC
		""")
	Slice<SoldCardResponse> findSoldCardsByCursor(
		@Param("horseId") String horseId,
		@Param("cursorId") int cursorId,
		Pageable pageable
	);

	@Query("""
		    SELECT new com.example.grandehorse.domain.trading.controller.response.PriceHistoryResponse(
		        MAX(t.price),
		        AVG(t.price),
		        MIN(t.price),
		        CAST(t.soldAt AS date)
		    )
		    FROM CardTradeEntity t
		    WHERE t.horseId = :horseId
		    AND t.status = 'SOLD'
		    AND t.soldAt BETWEEN :startDateTime AND :endDateTime
		    GROUP BY CAST(t.soldAt AS date)
		    ORDER BY CAST(t.soldAt AS date) DESC
		""")
	List<PriceHistoryResponse> findPriceHistory(
		@Param("horseId") String horseId,
		@Param("startDateTime") LocalDate startDateTime,
		@Param("endDateTime") LocalDate endDateTime
	);
}
