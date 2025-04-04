package com.example.grandehorse.domain.horse.entity;

import java.util.List;

import com.example.grandehorse.global.exception.CardException;
import com.example.grandehorse.global.exception.CustomError;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Getter;

/**
 * 프론트 요청으로 색상은 소문자로 응답 반환
 */
@Getter
public enum HorseRank {
	LEGEND,
	UNIQUE,
	EPIC,
	RARE,
	NORMAL;

	private static final List<HorseRank> UPGRADE_ORDER = List.of(NORMAL, RARE, EPIC, UNIQUE, LEGEND);

	public HorseRank next() {
		int index = UPGRADE_ORDER.indexOf(this);
		if (index == -1 || index >= UPGRADE_ORDER.size() - 1) {
			throw new CardException(CustomError.CARD_COMBINATION_RANK_NOT_FOUND);
		}
		return UPGRADE_ORDER.get(index + 1);
	}

	@JsonValue
	public String toLowerCase() {
		return name().toLowerCase();
	}
}
