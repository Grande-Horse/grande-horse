package com.example.grandehorse.domain.trading.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.horse.service.HorseService;
import com.example.grandehorse.domain.trading.controller.request.CreateCardTradeDto;
import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.entity.CardTradeEntity;
import com.example.grandehorse.domain.trading.entity.CardTradeStatus;
import com.example.grandehorse.domain.trading.repository.CardTradingJpaRepository;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class TradingService {
	private final HorseService horseService;
	private final CardService cardService;

	private final CardTradingJpaRepository cardTradingJpaRepository;

	@Transactional
	public ResponseEntity<CommonResponse<Void>> createCardTrade(CreateCardTradeDto createTradeDto) {
		/* TODO
		    1. 유저의 말인지 체크 (일부 완료 -> 유저 토큰에서 유저아이디 꺼내와야함)
		    2. 판매가능한 말인지 체크 (완료)
			3. 유저가 소유한 카드 상태 판매마로 변경 (완료)
			4. 경매장에 카드 등록 (완료)
		 */
		cardService.isUserOwnsCard(1, createTradeDto.getCardId());

		cardService.isCardAvailableForSale(createTradeDto.getCardId());

		cardService.updateCardStatusToSell(createTradeDto.getCardId());

		CardTradeEntity cardTradeEntity = CardTradeEntity.builder()
			.horseId(createTradeDto.getHorseId())
			.cardId(createTradeDto.getCardId())
			.sellerId(createTradeDto.getSellerId())
			.status(CardTradeStatus.REGISTERED)
			.price(createTradeDto.getPrice())
			.registeredAt(LocalDateTime.now())
			.build();

		cardTradingJpaRepository.save(cardTradeEntity);

		return CommonResponse.success(null);
	}

	@Transactional
	public ResponseEntity<CommonResponse<Void>> purchaseCard(int cardTradeId) {
		/* TODO
			1. 판매중인 말인지 체크
			2. 카드의 주인인지 체크
			2. 말 카드 주인 변경, 전적 초기화, 획득 방법 변경, 획득 일시 변경
			3. 카드 기록에 저장
			4. 카드 판매 처리 (완료)
		 */

		CardTradeEntity cardTradeEntity = findCardTradeByCardTradeId(cardTradeId);

		int horseId = horseService.findHorseDataIdByHorseId(cardTradeEntity.getHorseId());
		cardTradeEntity.purchase(horseId); // 카드가 판매된 시점의 카드 스탯, 등급 등 저장

		cardTradingJpaRepository.save(cardTradeEntity);

		return CommonResponse.success(null);
	}

	@Transactional
	public ResponseEntity<CommonResponse<Void>> cancelCardTrade(int cardTradeId) {
		/* TODO
			1. 판매중인 말인지 체크
			2. 카드의 주인인지 체크
			4. 말카드 상태 변경
			4. 카드 취소 처리 (완료)
		 */

		CardTradeEntity cardTradeEntity = findCardTradeByCardTradeId(cardTradeId);
		cardTradeEntity.cancel();

		cardTradingJpaRepository.save(cardTradeEntity);

		return CommonResponse.success(null);
	}

	public ResponseEntity<CommonResponse<List<TradeCardResponse>>> getTradeCards(
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		List<TradeCardResponse> tradeCards = findTradeCardsByCursor(
			cursorId,
			rank,
			search,
			limit
		);
		boolean hasNextItems = hasNextPage(tradeCards, limit);
		int nextCursorId = getNextCursorId(hasNextItems, cursorId);

		return CommonResponse.pagedSuccess(tradeCards, hasNextItems, nextCursorId);
	}

	public ResponseEntity<CommonResponse<List<RegisteredCardResponse>>> getRegisteredCards(
		int sellerId,
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		List<RegisteredCardResponse> registeredCards = findRegisteredCardsByCursor(
			sellerId,
			cursorId,
			rank,
			search,
			limit
		);
		boolean hasNextItems = hasNextPage(registeredCards, limit);
		int nextCursorId = getNextCursorId(hasNextItems, cursorId + limit);

		return CommonResponse.pagedSuccess(registeredCards, hasNextItems, nextCursorId);
	}

	private CardTradeEntity findCardTradeByCardTradeId(int cardTradeId) {
		return cardTradingJpaRepository.findCardTradeById(cardTradeId);
	}

	private List<TradeCardResponse> findTradeCardsByCursor(
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		return cardTradingJpaRepository.findTradeCardsByCursor(
			cursorId,
			rank,
			search,
			PageRequest.of(0, limit)
		);
	}

	private List<RegisteredCardResponse> findRegisteredCardsByCursor(
		int sellerId,
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		return cardTradingJpaRepository.findRegisteredCardsByCursor(
			sellerId,
			cursorId,
			rank,
			search,
			PageRequest.of(0, limit)
		);
	}

	private boolean hasNextPage(List<?> cards, int limit) {
		return cards.size() == limit;
	}

	private int getNextCursorId(boolean hasNextPage, int cursorId) {
		if (hasNextPage) {
			return cursorId;
		}

		return -1;
	}
}
