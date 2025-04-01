package com.example.grandehorse.domain.horse.entity;

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

	@JsonValue
	public String toLowerCase() {
		return name().toLowerCase();
	}

	public static HorseRank fromString(String rank) {
		HorseRank horseRank = null;

		for (HorseRank value : HorseRank.values()) {
			if (value.name().equalsIgnoreCase(rank)) {
				horseRank = value;
			}
		}

		return horseRank;
	}
}
