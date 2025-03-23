package com.example.grandehorse.domain.card.entity;

import lombok.Getter;

/**
 * TRADE : 거래를 통해 카드를 획득
 * CARDPACK : 카드팩을 통해 카드를 획득
 * COMBINATION : 합성을 통해 카드를 획득
 */
@Getter
public enum AcquiredWay {
	TRADE,
	CARDPACK,
	COMBINATION;
}
