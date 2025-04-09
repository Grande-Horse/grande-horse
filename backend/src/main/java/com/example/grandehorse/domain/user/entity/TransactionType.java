package com.example.grandehorse.domain.user.entity;

import lombok.Getter;

/**
 * CASH_PURCHASE : 현금으로 상품 구매하여 코인 사용
 * COIN_PURCHASE : 코인으로 상품 구매하여 코인 사용
 * STEP : 발검음을 코인으로 전환하여 코인 획득
 * AD_WATCH : 광고를 시청하여 코인 획득
 * CARD_TRADE : 말 카드 거래로 코인 사용
 * RACE_RECORD : 경마에 참여하여 코인 사용, 경마에서 승리하여 코인 획득
 */
@Getter
public enum TransactionType {
	CASH_PURCHASE,
	COIN_PURCHASE,
	STEP,
	AD_WATCH,
	TRADE,
	RACE_RECORD;
}
