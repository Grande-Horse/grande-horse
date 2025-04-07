package com.example.grandehorse.domain.card.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CardRaceRecordResponseDto {
	private int cardId;

	private int totalFirstPlaces;

	private int totalSecondPlaces;

	private int totalThirdPlaces;

	private int totalRaces;

	private long totalPrize;
}
