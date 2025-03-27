package com.example.grandehorse.domain.trading.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.trading.controller.response.PriceHistoryResponse;
import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.SoldCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.entity.CardTradeEntity;
import com.example.grandehorse.domain.trading.entity.CardTradeStatus;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface CardTradingJpaRepository extends JpaRepository<CardTradeEntity, Integer> {
	CardTradeEntity findCardTradeById(int cardTradeId);

	boolean existsByIdAndStatus(int id, CardTradeStatus status);

	/* TODO
	   	검색 기능 ngram 사용하여 최적화 시키기
	   	JPA N+1 문제 확인하기
	 */
	@Query("""
			SELECT new com.example.grandehorse.domain.trading.controller.response.TradeCardResponse(
				t.id,
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
			AND h.horseRank = :horseRank
			AND h.name LIKE CONCAT('%', :search, '%')
			ORDER BY t.id DESC
		""")
	Slice<TradeCardResponse> findTradeCardsByCursor(
		@Param("cursorId") int cursorId,
		@Param("horseRank") String horseRank,
		@Param("search") String search,
		Pageable pageable
	);

	/* TODO
   		검색 기능 ngram 사용하여 최적화 시키기
   		JPA N+1 문제 확인하기
 	*/
	@Query("""
			SELECT new com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse(
				t.id,
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
			AND t.sellerId = :sellerId
			AND t.id > :cursorId
			AND h.horseRank = :horseRank
			AND h.name LIKE CONCAT('%', :search, '%')
			ORDER BY t.id DESC
		""")
	Slice<RegisteredCardResponse> findRegisteredCardsByCursor(
		@Param("sellerId") int sellerId,
		@Param("cursorId") int cursorId,
		@Param("horseRank") String horseRank,
		@Param("search") String search,
		Pageable pageable
	);

	@Query("""
			SELECT new com.example.grandehorse.domain.trading.controller.response.SoldCardResponse(
				h.coatColor,
				h.name,
				h.horseRank,
				d.speed,
				d.acceleration,
				d.stamina,
				t.price,
				t.soldAt
			)
			FROM CardTradeEntity t
			JOIN HorseEntity h ON h.id = t.horseId
			JOIN HorseDataEntity d ON d.id = t.horseDataId
			WHERE t.horseId = :horseId
			AND t.status = 'SOLD'
			AND t.id > :cursorId
			ORDER BY t.id DESC
		""")
	Slice<SoldCardResponse> findSoldCardsByCursor(
		@Param("horseId") String horseId,
		@Param("cursorId") int cursorId,
		Pageable pageable
	);

	@Query("""
			SELECT new com.example.grandehorse.domain.trading.controller.response.PriceHistoryResponse(
				MAX(t.price) AS highestPrice,
				AVG(t.price) AS averagePrice,
				MIN(t.price) AS lowestPrice,
				t.soldAt::date AS soldAt
			)
			FROM CardTradeEntity t
			WHERE t.horseId = :horseId
			AND t.status = 'SOLD'
			AND t.soldAt BETWEEN :oneDayAgo AND :sevenDaysAgo
			GROUP BY t.soldAt::date
			ORDER BY t.soldAt DESC
		""")
	List<PriceHistoryResponse> findPriceHistory(
		@Param("horseId") String horseId,
		@Param("oneDayAgo") LocalDateTime oneDayAgo,
		@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo
	);
}
