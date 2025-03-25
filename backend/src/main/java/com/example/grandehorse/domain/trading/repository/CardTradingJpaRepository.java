package com.example.grandehorse.domain.trading.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.entity.CardTradeEntity;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface CardTradingJpaRepository extends JpaRepository<CardTradeEntity, Integer> {
	CardTradeEntity findCardTradeById(int cardTradeId);

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
			AND t.id >= :cursorId
			AND h.horseRank = :horseRank
			AND h.name LIKE CONCAT('%', :search, '%')
		    ORDER BY t.id DESC
		""")
	List<TradeCardResponse> findTradeCardsByCursor(
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
			AND t.id >= :cursorId
			AND h.horseRank = :horseRank
			AND h.name LIKE CONCAT('%', :search, '%')
		    ORDER BY t.id DESC
		""")
	List<RegisteredCardResponse> findRegisteredCardsByCursor(
		@Param("sellerId") int sellerId,
		@Param("cursorId") int cursorId,
		@Param("horseRank") String horseRank,
		@Param("search") String search,
		Pageable pageable
	);
}
