package com.example.grandehorse.domain.trading.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.horse.entity.HorseRank;
import com.example.grandehorse.domain.horse.service.HorseService;
import com.example.grandehorse.domain.trading.controller.request.CreateCardTradeDto;
import com.example.grandehorse.domain.trading.controller.response.PriceHistoryResponse;
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

	// 완료
	@Transactional
	public ResponseEntity<CommonResponse<Void>> createCardTrade(CreateCardTradeDto createTradeDto, int userId) {
		cardService.validateCardOwnedByUser(userId, createTradeDto.getCardId());
		cardService.validateCardAvailableForSale(createTradeDto.getCardId());

		cardService.updateCardStatusToSell(createTradeDto.getCardId());

		registerCardTrade(createTradeDto, userId);

		return CommonResponse.success(null);
	}

	// 완료
	@Transactional
	public ResponseEntity<CommonResponse<Void>> purchaseCard(int cardTradeId, int userId) {
		CardTradeEntity cardTradeEntity = findCardTradeByCardTradeId(cardTradeId);

		validateCardForSale(cardTradeId);
		validateCardPurchasability(cardTradeEntity.getSellerId(), userId);

		userService.purchaseCard(userId, cardTradeEntity.getSellerId(), cardTradeEntity.getPrice());

		cardService.changeCardOwner(cardTradeEntity.getCardId(), userId, cardTradeId);

		processCardSale(cardTradeEntity, userId);

		return CommonResponse.success(null);
	}

	// 완료
	@Transactional
	public ResponseEntity<CommonResponse<Void>> cancelCardTrade(int cardTradeId, int userId) {
		CardTradeEntity cardTradeEntity = findCardTradeByCardTradeId(cardTradeId);

		validateCardForSale(cardTradeId);
		validateCardTradeCancellation(cardTradeEntity.getSellerId(), userId);

		cardService.updateCardStatusToReady(cardTradeEntity.getCardId());

		cardTradeEntity.cancel();
		cardTradingJpaRepository.save(cardTradeEntity);

		return CommonResponse.success(null);
	}

	// 완료
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

		List<TradeCardResponse> tradeCards = tradeCardSlice.getContent().stream()
			.sorted(Comparator.comparing(TradeCardResponse::getTradeId).reversed())
			.collect(Collectors.toUnmodifiableList());

		boolean hasNextItems = tradeCardSlice.hasNext();

		int nextCursorId = -1;
		if (hasNextItems) {
			nextCursorId = tradeCards.get(0).getTradeId();
		}

		return CommonResponse.pagedSuccess(tradeCards, hasNextItems, nextCursorId);
	}

	// 완료
	public ResponseEntity<CommonResponse<List<RegisteredCardResponse>>> getRegisteredCards(
		int sellerId,
		int cursorId,
		int limit
	) {
		Slice<RegisteredCardResponse> registeredCardSlice = findRegisteredCardsByCursor(
			sellerId,
			cursorId,
			limit
		);

		List<RegisteredCardResponse> registeredCards = registeredCardSlice.getContent().stream()
			.sorted(Comparator.comparing(RegisteredCardResponse::getTradeId).reversed())
			.collect(Collectors.toUnmodifiableList());

		boolean hasNextItems = registeredCardSlice.hasNext();

		int nextCursorId = -1;
		if (hasNextItems) {
			nextCursorId = registeredCards.get(0).getTradeId();
		}

		return CommonResponse.pagedSuccess(registeredCards, hasNextItems, nextCursorId);
	}


	public ResponseEntity<CommonResponse<List<SoldCardResponse>>> getSoldCards(
		String horseId,
		int cursorId,
		int limit
	) {
		Slice<SoldCardResponse> soldCardsSlice = findSoldCardsByCursor(horseId, cursorId, limit);

		List<SoldCardResponse> soldCards = soldCardsSlice.getContent().stream()
			.sorted(Comparator.comparing(SoldCardResponse::getSoldAt).reversed())
			.collect(Collectors.toUnmodifiableList());

		boolean hasNextItems = soldCardsSlice.hasNext();

		int nextCursorId = -1;
		if (hasNextItems) {
			nextCursorId = soldCards.get(0).getTradeId();
		}

		return CommonResponse.pagedSuccess(soldCards, hasNextItems, nextCursorId);
	}

	/* TODO
		스케줄링 돌려서 매일 밤 12시에 데이터 들고와서 레디스에 올려놓는 방식으로 리팩토링하기 (성능 개선)
	 */
	public ResponseEntity<CommonResponse<List<PriceHistoryResponse>>> getPriceHistory(String horseId) {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime oneDayAgo = now.minusDays(1);
		LocalDateTime sevenDaysAgo = now.minusDays(7);

		List<PriceHistoryResponse> priceHistories
			= cardTradingJpaRepository.findPriceHistory(horseId, oneDayAgo, sevenDaysAgo);

		Map<LocalDate, PriceHistoryResponse> historyMap = priceHistories.stream()
			.collect(Collectors.toMap(PriceHistoryResponse::getDate, Function.identity()));

		List<PriceHistoryResponse> completeList = new ArrayList<>();
		for (LocalDate date = sevenDaysAgo.toLocalDate(); !date.isAfter(oneDayAgo.toLocalDate()); date = date.plusDays(
			1)) {
			PriceHistoryResponse response = historyMap.get(date);
			if (response == null) {
				completeList.add(new PriceHistoryResponse(0, 0.0, 0, date));
			} else {
				completeList.add(response);
			}
		}

		return CommonResponse.listSuccess(completeList);
	}

	private void registerCardTrade(CreateCardTradeDto createTradeDto, int userId) {
		String horseId = cardService.findHorseIdByCardId(createTradeDto.getCardId());

		CardTradeEntity cardTradeEntity = CardTradeEntity.builder()
			.horseId(horseId)
			.cardId(createTradeDto.getCardId())
			.sellerId(userId)
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

	private void processCardSale(CardTradeEntity cardTradeEntity, int buyerId) {
		int horseId = horseService.findHorseDataIdByHorseId(cardTradeEntity.getHorseId());
		cardTradeEntity.purchase(horseId, buyerId); // 카드가 판매된 시점의 카드 스탯, 등급 등 저장
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
		Pageable pageable = PageRequest.of(0, limit);

		return cardTradingJpaRepository.findTradeCardsByCursor(
			cursorId,
			HorseRank.fromString(rank),
			search,
			pageable
		);
	}

	private Slice<RegisteredCardResponse> findRegisteredCardsByCursor(
		int sellerId,
		int cursorId,
		int limit
	) {
		Pageable pageable = PageRequest.of(0, limit);

		return cardTradingJpaRepository.findRegisteredCardsByCursor(
			sellerId,
			cursorId,
			pageable
		);
	}

	private Slice<SoldCardResponse> findSoldCardsByCursor(
		String horseId,
		int cursorId,
		int limit
	) {
		Pageable pageable = PageRequest.of(0, limit);

		return cardTradingJpaRepository.findSoldCardsByCursor(
			horseId,
			cursorId,
			pageable
		);
	}
}
