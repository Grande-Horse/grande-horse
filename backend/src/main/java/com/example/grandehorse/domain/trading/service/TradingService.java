package com.example.grandehorse.domain.trading.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.horse.service.HorseService;
import com.example.grandehorse.domain.trading.controller.request.CreateCardTradeDto;
import com.example.grandehorse.domain.trading.controller.response.RegisteredCardResponse;
import com.example.grandehorse.domain.trading.controller.response.SoldCardResponse;
import com.example.grandehorse.domain.trading.controller.response.TradeCardResponse;
import com.example.grandehorse.domain.trading.entity.CardTradeEntity;
import com.example.grandehorse.domain.trading.entity.CardTradeStatus;
import com.example.grandehorse.domain.trading.repository.CardTradingJpaRepository;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.TradingException;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TradingService {
	private final HorseService horseService;
	private final CardService cardService;
	private final UserService userService;

	private final CardTradingJpaRepository cardTradingJpaRepository;

	@Transactional
	public ResponseEntity<CommonResponse<Void>> createCardTrade(CreateCardTradeDto createTradeDto) {
		cardService.validateCardOwnedByUser(2, createTradeDto.getCardId());
		cardService.validateCardAvailableForSale(createTradeDto.getCardId());

		cardService.updateCardStatusToSell(createTradeDto.getCardId());

		registerCardTrade(createTradeDto);

		return CommonResponse.success(null);
	}

	@Transactional
	public ResponseEntity<CommonResponse<Void>> purchaseCard(int cardTradeId) {
		CardTradeEntity cardTradeEntity = findCardTradeByCardTradeId(cardTradeId);

		validateCardForSale(cardTradeId);
		validateCardPurchasability(cardTradeEntity.getSellerId(), 2);

		userService.purchaseCard(2, cardTradeEntity.getSellerId(), cardTradeEntity.getPrice());

		cardService.changeCardOwner(cardTradeEntity.getCardId(), 2, cardTradeId);

		processCardSale(cardTradeEntity);

		return CommonResponse.success(null);
	}

	@Transactional
	public ResponseEntity<CommonResponse<Void>> cancelCardTrade(int cardTradeId) {
		CardTradeEntity cardTradeEntity = findCardTradeByCardTradeId(cardTradeId);

		validateCardForSale(cardTradeId);
		validateCardTradeCancellation(cardTradeEntity.getSellerId(), 2);

		cardService.updateCardStatusToReady(cardTradeEntity.getCardId());

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
		Slice<TradeCardResponse> tradeCardSlice = findTradeCardsByCursor(
			cursorId,
			rank,
			search,
			limit
		);

		boolean hasNextItems = tradeCardSlice.hasNext();

		int nextCursorId = getNextCursorId(hasNextItems, cursorId, limit);

		return CommonResponse.pagedSuccess(tradeCardSlice.getContent(), hasNextItems, nextCursorId);
	}

	public ResponseEntity<CommonResponse<List<RegisteredCardResponse>>> getRegisteredCards(
		int sellerId,
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		Slice<RegisteredCardResponse> registeredCardSlice = findRegisteredCardsByCursor(
			sellerId,
			cursorId,
			rank,
			search,
			limit
		);

		boolean hasNextItems = registeredCardSlice.hasNext();

		int nextCursorId = getNextCursorId(hasNextItems, cursorId, limit);

		return CommonResponse.pagedSuccess(registeredCardSlice.getContent(), hasNextItems, nextCursorId);
	}

	public ResponseEntity<CommonResponse<List<SoldCardResponse>>> getSoldCards(
		String horseId,
		int cursorId,
		int limit
	) {
		Slice<SoldCardResponse> soldCardsSlice = findSoldCardsByCursor(horseId, cursorId, limit);

		boolean hasNextItems = soldCardsSlice.hasNext();

		int nextCursorId = getNextCursorId(hasNextItems, cursorId, limit);

		return CommonResponse.pagedSuccess(soldCardsSlice.getContent(), hasNextItems, nextCursorId);
	}

	private void registerCardTrade(CreateCardTradeDto createTradeDto) {
		CardTradeEntity cardTradeEntity = CardTradeEntity.builder()
			.horseId(createTradeDto.getHorseId())
			.cardId(createTradeDto.getCardId())
			.sellerId(createTradeDto.getSellerId())
			.status(CardTradeStatus.REGISTERED)
			.price(createTradeDto.getPrice())
			.registeredAt(LocalDateTime.now())
			.build();

		cardTradingJpaRepository.save(cardTradeEntity);
	}

	private CardTradeEntity findCardTradeByCardTradeId(int cardTradeId) {
		return cardTradingJpaRepository.findCardTradeById(cardTradeId);
	}

	private void validateCardForSale(int cardTradeId) {
		if (!cardTradingJpaRepository.existsByIdAndStatus(cardTradeId, CardTradeStatus.REGISTERED)) {
			throw new TradingException(CustomError.CARD_NOT_FOR_SALE);
		}
	}

	private void validateCardPurchasability(int sellerId, int userId) {
		if (sellerId == userId) {
			throw new TradingException(CustomError.CANNOT_PURCHASE_OWN_CARD);
		}
	}

	private void processCardSale(CardTradeEntity cardTradeEntity) {
		int horseId = horseService.findHorseDataIdByHorseId(cardTradeEntity.getHorseId());
		cardTradeEntity.purchase(horseId); // 카드가 판매된 시점의 카드 스탯, 등급 등 저장
		cardTradingJpaRepository.save(cardTradeEntity);
	}

	private void validateCardTradeCancellation(int sellerId, int userId) {
		if (sellerId != userId) {
			throw new TradingException(CustomError.CANNOT_CANCEL_TRADE_PERMISSION);
		}
	}

	private Slice<TradeCardResponse> findTradeCardsByCursor(
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		Pageable pageable = PageRequest.of(cursorId / limit, limit);

		return cardTradingJpaRepository.findTradeCardsByCursor(
			cursorId,
			rank,
			search,
			pageable
		);
	}

	private Slice<RegisteredCardResponse> findRegisteredCardsByCursor(
		int sellerId,
		int cursorId,
		String rank,
		String search,
		int limit
	) {
		Pageable pageable = PageRequest.of(cursorId / limit, limit);

		return cardTradingJpaRepository.findRegisteredCardsByCursor(
			sellerId,
			cursorId,
			rank,
			search,
			pageable
		);
	}

	private Slice<SoldCardResponse> findSoldCardsByCursor(
		String horseId,
		int cursorId,
		int limit
	) {
		Pageable pageable = PageRequest.of(cursorId / limit, limit);

		return cardTradingJpaRepository.findSoldCardsByCursor(
			horseId,
			cursorId,
			pageable
		);
	}

	private int getNextCursorId(boolean hasNextPage, int cursorId, int limit) {
		if (hasNextPage) {
			return cursorId + limit;
		}
		return -1;
	}
}
