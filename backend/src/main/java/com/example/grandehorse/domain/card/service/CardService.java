package com.example.grandehorse.domain.card.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.card.controller.request.CombineRequestDto;
import com.example.grandehorse.domain.card.controller.response.CardRaceRecordResponseDto;
import com.example.grandehorse.domain.card.controller.response.CardResponseDto;
import com.example.grandehorse.domain.card.entity.AcquiredWay;
import com.example.grandehorse.domain.card.entity.CardCombinationEntity;
import com.example.grandehorse.domain.card.entity.CardCombinationRank;
import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.card.entity.CardRecordEntity;
import com.example.grandehorse.domain.card.repository.CardCombinationRankRepository;
import com.example.grandehorse.domain.card.repository.CardCombinationRepository;
import com.example.grandehorse.domain.card.repository.CardJpaRepository;
import com.example.grandehorse.domain.card.repository.CardRecordJpaRepository;
import com.example.grandehorse.domain.horse.entity.HorseEntity;
import com.example.grandehorse.domain.horse.entity.HorseRank;
import com.example.grandehorse.domain.horse.service.HorseService;
import com.example.grandehorse.domain.race.service.RaceRecordService;
import com.example.grandehorse.global.exception.CardException;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {
	private final HorseService horseService;
	private final RaceRecordService raceRecordService;

	private final CardJpaRepository cardJpaRepository;
	private final CardCombinationRepository cardCombinationRepository;
	private final CardCombinationRankRepository cardCombinationRankRepository;
	private final CardRecordJpaRepository cardRecordJpaRepository;

	public CardEntity findRepresentativeCard(int userId) {
		return cardJpaRepository.findCardByUserIdAndStatus(userId, 3)
			.orElseThrow(() -> new CardException(CustomError.NO_REPRESENTATIVE_HORSE_CARD));
	}

	public void validateCardOwnedByUser(int userId, int cardId) {
		if (!cardJpaRepository.existsByUserIdAndId(userId, cardId)) {
			throw new CardException(CustomError.USER_NOT_OWNER_OF_CARD);
		}
	}

	/**
	 * 0 : 대기마
	 * 1 : 판매마
	 * 2 : 경주마
	 * 3 : 출전마
	 * 대기마의 경우 서비스상 아무곳에서도 사용되지 않기 때문에 대기마만 판매등록이 가능합니다.
	 */
	public void validateCardAvailableForSale(int cardId) {
		if (!cardJpaRepository.existsByIdAndStatus(cardId, (byte)0)) {
			throw new CardException(CustomError.CARD_SALE_RESTRICTED);
		}
	}

	@Transactional
	public void updateCardStatusToSell(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findCardByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateStatusToSell();
		cardJpaRepository.save(cardEntity);
	}

	public String findHorseIdByCardId(int cardId) {
		return cardJpaRepository.findHorseIdById(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));
	}

	@Transactional
	public void updateCardStatusToReady(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findCardByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateStatusToReady();
		cardJpaRepository.save(cardEntity);
	}

	@Transactional
	public void changeCardOwner(int cardId, int userId, int cardTradeId) {
		CardEntity cardEntity = cardJpaRepository.findCardByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateOwner(userId);
		cardJpaRepository.save(cardEntity);

		saveCardAcquisitionRecord(cardId, userId, cardTradeId);
	}

	public boolean hasRepresentativeHorseCard(int userId) {
		return cardJpaRepository.existsByUserIdAndStatus(userId, (byte)3);
	}

	private void saveCardAcquisitionRecord(int cardId, int userId, int cardTradeId) {
		CardRecordEntity cardRecord = CardRecordEntity.builder()
			.cardId(cardId)
			.userId(userId)
			.acquiredWay(AcquiredWay.TRADE)
			.acquiredId(cardTradeId)
			.acquiredAt(LocalDateTime.now())
			.build();

		cardRecordJpaRepository.save(cardRecord);
	}

	public ResponseEntity<CommonResponse<List<CardResponseDto>>> getRaceCards(int userId) {
		List<CardResponseDto> raceHorseCards = cardJpaRepository.findRaceCards(userId, List.of((byte)2, (byte)3));

		return CommonResponse.listSuccess(raceHorseCards);
	}

	public ResponseEntity<CommonResponse<List<CardResponseDto>>> getUserCardList(
		int userId,
		String rank,
		int cursorId,
		int limit
	) {
		HorseRank horseRank = null;
		if (rank != null && !"ALL".equalsIgnoreCase(rank) && !rank.isBlank()) {
			try {
				horseRank = HorseRank.valueOf(rank.toUpperCase());
			} catch (IllegalArgumentException ex) {
				throw new CardException(CustomError.INVALID_RANK_VALUE);
			}
		}

		Slice<CardResponseDto> userCardSlice = findUserCardsByCursor(userId, horseRank, cursorId, limit);
		List<CardResponseDto> items = userCardSlice.getContent();
		boolean hasNextItems = userCardSlice.hasNext();
		int nextCursorId = getNextCursorId(items, hasNextItems);

		return CommonResponse.pagedSuccess(items, hasNextItems, nextCursorId);
	}

	public ResponseEntity<CommonResponse<CardRaceRecordResponseDto>> getCardRaceRecord(int userId, int cardId) {
		CardEntity cardEntity = cardJpaRepository.findByIdAndUserId(cardId, userId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		CardRaceRecordResponseDto raceRecords = raceRecordService.getCardRaceRecord(userId, cardEntity);

		return CommonResponse.success(raceRecords);
	}

	@Transactional
	public ResponseEntity<CommonResponse<Void>> changeRepresentativeCard(int userId, int cardId) {
		validateCardOwnedByUser(userId, cardId);
		validateCardForRepresentation(userId, cardId);

		resetCurrentRepresentative(userId);
		setCardAsRepresentative(cardId);

		return CommonResponse.success(null);
	}

	private Slice<CardResponseDto> findUserCardsByCursor(
		int userId,
		HorseRank horseRank,
		int cursorId,
		int limit
	) {
		Pageable pageable = PageRequest.of(0, limit);

		return cardJpaRepository.findUserCardsByCursor(userId, horseRank, cursorId, pageable);
	}

	private int getNextCursorId(List<CardResponseDto> items, boolean hasNextPage) {
		if (!hasNextPage || items.isEmpty()) {
			return -1;
		}
		return items.get(items.size() - 1).getCardId();
	}

	private void validateCardForRepresentation(int userId, int cardId) {
		CardEntity cardEntity = cardJpaRepository.findByIdAndUserId(cardId, userId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		if (cardEntity.getStatus() != 2) {
			throw new CardException(CustomError.CARD_NOT_ELIGIBLE_FOR_REPRESENTATION);
		}
	}

	private void resetCurrentRepresentative(int userId) {
		CardEntity cardEntity = cardJpaRepository.findByUserIdAndStatus(userId, (byte)3).orElse(null);

		if (cardEntity != null) {
			cardEntity.updateStatusToRace();
		}
	}

	private void setCardAsRepresentative(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findCardByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateStatusToRepresentative();
	}

	public void toggleCandidateStatus(int userId, int cardId) {
		CardEntity cardEntity = cardJpaRepository.findByIdAndUserId(cardId, userId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		int currentStatus = cardEntity.getStatus();

		if (currentStatus == 0) {
			validateCandidateLimit(userId);
			cardEntity.updateStatusToRace();
		} else if (currentStatus == 2) {
			cardEntity.updateStatusToReady();
		} else {
			throw new CardException(CustomError.CARD_NOT_ELIGIBLE_FOR_CANDIDATE);
		}

		cardJpaRepository.save(cardEntity);
	}

	private void validateCandidateLimit(int userId) {
		int activeCount = cardJpaRepository.countByUserIdAndStatusIn(userId, List.of((byte)2, (byte)3));
		if (activeCount >= 6) {
			throw new CardException(CustomError.CARD_CANDIDATE_LIMIT_EXCEEDED);
		}
	}

	@Transactional
	public ResponseEntity<CommonResponse<CardResponseDto>> combineCards(int userId, CombineRequestDto request) {
		List<Integer> cardIds = request.getCardIds();

		List<CardEntity> cards = getValidCardsForCombination(userId, cardIds);

		HorseRank currentRank = getHorseRankForCombination(cards);

		HorseRank upperRank = getNextHorseRank(currentRank);

		CardCombinationRank combinationRank = findCombinationPossibility(upperRank);

		boolean isSuccess = decideCombinationSuccess(combinationRank.getProbability());

		CardCombinationEntity combinationRecord = saveCombinationRecord(combinationRank.getId(), isSuccess);

		if (isSuccess) {
			deleteOriginalCards(cards, combinationRecord.getId());

			CardEntity newCard = createAndSaveCombinedCard(userId, upperRank, combinationRecord.getId());
			recordCardCombination(newCard, userId, combinationRecord.getId());

			HorseEntity horse = horseService.getHorseById(newCard.getHorseId());

			CardResponseDto responseDto = toCardResponseDto(newCard, horse);
			return CommonResponse.success(responseDto);
		}

		return CommonResponse.success(createFailureCardResponseDto());
	}

	private List<CardEntity> getValidCardsForCombination(int userId, List<Integer> cardIds) {
		if (cardIds.size() != 3) {
			throw new CardException(CustomError.INVALID_COMBINATION_COUNT);
		}

		List<CardEntity> cards = cardJpaRepository.findAllByIdInAndUserIdAndStatusAndDeletedAtIsNull(cardIds, userId,
			(byte)0);
		if (cards.size() != 3) {
			throw new CardException(CustomError.CARD_NOT_OWNED_OR_INVALID_STATUS);
		}

		return cards;
	}

	private HorseRank getHorseRankForCombination(List<CardEntity> cards) {
		Set<String> horseIds = cards.stream()
			.map(CardEntity::getHorseId)
			.collect(Collectors.toSet());

		return horseService.getSingleHorseRankByIds(horseIds);
	}

	private CardCombinationRank findCombinationPossibility(HorseRank upperRank) {
		return cardCombinationRankRepository.findByHorseRank(upperRank)
			.orElseThrow(() -> new CardException(CustomError.CARD_COMBINATION_RANK_NOT_FOUND));
	}

	private boolean decideCombinationSuccess(double probability) {
		return Math.random() < probability;
	}

	private CardCombinationEntity saveCombinationRecord(byte rankId, boolean isSuccess) {
		CardCombinationEntity record = CardCombinationEntity.builder()
			.rankId(rankId)
			.success(isSuccess)
			.build();

		return cardCombinationRepository.save(record);
	}

	private void deleteOriginalCards(List<CardEntity> cards, int combinationId) {
		cards.forEach(card -> card.markAsCombined(combinationId));
		cardJpaRepository.saveAll(cards);
	}

	private CardEntity createAndSaveCombinedCard(int userId, HorseRank upperRank, int combinationId) {
		HorseEntity selectedHorse = pickRandomHorse(upperRank);

		CardEntity newCard = createCombinedCard(userId, selectedHorse.getId(), combinationId);

		return cardJpaRepository.save(newCard);
	}

	private HorseRank getNextHorseRank(HorseRank currentRank) {
		return currentRank.next();
	}

	private HorseEntity pickRandomHorse(HorseRank upgradedRank) {
		return horseService.pickRandomHorseByRank(upgradedRank);
	}

	private CardEntity createCombinedCard(int userId, String horseId, int combinationId) {
		return CardEntity.builder()
			.userId(userId)
			.horseId(horseId)
			.status((byte)0)
			.acquiredWay(AcquiredWay.COMBINATION)
			.acquiredAt(LocalDateTime.now())
			.raceCount((short)0)
			.victoryCount((short)0)
			.totalPrize(0)
			.combinationId(combinationId)
			.build();
	}

	private void recordCardCombination(CardEntity newCard, int userId, int combinationId) {
		CardRecordEntity record = CardRecordEntity.builder()
			.cardId(newCard.getId())
			.userId(userId)
			.acquiredWay(AcquiredWay.COMBINATION)
			.acquiredId(combinationId)
			.acquiredAt(newCard.getAcquiredAt())
			.build();

		cardRecordJpaRepository.save(record);
	}

	private CardResponseDto toCardResponseDto(CardEntity card, HorseEntity horse) {
		return CardResponseDto.builder()
			.cardId(card.getId())
			.horseId(card.getHorseId())
			.status(card.getStatus())
			.coatColor(horse.getCoatColor())
			.name(horse.getName())
			.horseRank(horse.getHorseRank())
			.weight(horse.getWeight())
			.speed(horse.getSpeed())
			.acceleration(horse.getAcceleration())
			.stamina(horse.getStamina())
			.build();
	}

	private CardResponseDto createFailureCardResponseDto() {
		return CardResponseDto.builder()
			.cardId(-1)
			.build();
	}

	public CardResponseDto getRepresentativeCard(int userId) {
		CardEntity card = cardJpaRepository.findByUserIdAndStatus(userId, (byte)3).orElse(null);

		if (card == null) {
			return null;
		}

		HorseEntity horse = horseService.getHorseById(card.getHorseId());

		return toCardResponseDto(card, horse);
	}

	@Transactional
	public void updateCardWinRecord(int cardId, int totalPrize) {
		CardEntity cardEntity = cardJpaRepository.findCardByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateWinRecord(totalPrize);
	}

	public void updateCardRaceRecord(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findCardByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateRaceRecord();
	}
}
