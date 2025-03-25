package com.example.grandehorse.domain.card.service;

import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.card.repository.CardJpaRepository;
import com.example.grandehorse.global.exception.CardException;
import com.example.grandehorse.global.exception.CustomError;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CardService {
	private final CardJpaRepository cardJpaRepository;

	public void isUserOwnsCard(int userId, int cardId) {
		cardJpaRepository.findByUserIdAndId(userId, cardId)
			.orElseThrow(() -> new CardException(CustomError.USER_NOT_OWNER_OF_CARD));
	}

	public void isCardAvailableForSale(int cardId) {
		cardJpaRepository.findByIdAndStatus(cardId, (byte)0)
			.orElseThrow(() -> new CardException(CustomError.CARD_SALE_RESTRICTED));
	}

	public void updateCardStatusToSell(int cardId) {
		CardEntity cardEntity = cardJpaRepository.findById(cardId)
									.orElseThrow(() -> new CardException(CustomError.CARD_NOT_EXISTED));

		cardEntity.updateStatusToSell();
		cardJpaRepository.save(cardEntity);
	}

	public void changeCardOwner(int cardId, int userId) {

	}
}
