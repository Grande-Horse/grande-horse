package com.example.grandehorse.domain.card.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.card.entity.AcquiredWay;
import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.card.entity.CardRecordEntity;
import com.example.grandehorse.domain.card.repository.CardJpaRepository;
import com.example.grandehorse.domain.card.repository.CardRecordJpaRepository;
import com.example.grandehorse.global.exception.CardException;
import com.example.grandehorse.global.exception.CustomError;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {
	private final CardJpaRepository cardJpaRepository;
	private final CardRecordJpaRepository cardRecordJpaRepository;

	public void validateCardOwnedByUser(int userId, int cardId) {
		if (!cardJpaRepository.existsByUserIdAndId(userId, cardId)) {
			throw new CardException(CustomError.USER_NOT_OWNER_OF_CARD);
		}
	}

	public void validateCardAvailableForSale(int cardId) {
		if (!cardJpaRepository.existsByIdAndStatus(cardId, (byte) 0)) {
			throw new CardException(CustomError.CARD_SALE_RESTRICTED);
		}
	}

	@Transactional
	public void updateCardStatusToSell(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateStatusToSell();
		cardJpaRepository.save(cardEntity);
	}

	@Transactional
	public void updateCardStatusToReady(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateStatusToReady();
		cardJpaRepository.save(cardEntity);
	}

	@Transactional
	public void changeCardOwner(int cardId, int userId, int cardTradeId) {
		CardEntity cardEntity = cardJpaRepository.findByIdWithPessimisticLock(cardId)
			.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateOwner(userId);
		cardJpaRepository.save(cardEntity);

		saveCardAcquisitionRecord(cardId, userId, cardTradeId);
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


}
