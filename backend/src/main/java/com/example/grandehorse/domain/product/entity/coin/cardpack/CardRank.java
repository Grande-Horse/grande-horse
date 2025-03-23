package com.example.grandehorse.domain.product.entity.coin.cardpack;

import lombok.Getter;

/**
 * 카드 랭크를 정의하는 enum 입니다.
 * 프론트 쪽 요청으로 value 값은 소문자로 처리하였습니다.
 */
@Getter
public enum CardRank {
	NORMAL("normal"),
	RARE("rare"),
	EPIC("epic"),
	UNIQUE("unique"),
	LEGEND("legend");

	private final String value;

	CardRank(String value) {
		this.value = value;
	}
}
