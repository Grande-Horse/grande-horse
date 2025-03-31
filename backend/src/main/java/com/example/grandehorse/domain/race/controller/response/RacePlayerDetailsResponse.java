package com.example.grandehorse.domain.race.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RacePlayerDetailsResponse {
	private int cardId;

	private String horseId;

	private String userNickname;

	private String horseName;

	private String horseColor;

	private String horseRank;

	private double horseWeight;

	private double horseSpeed;

	private double horseAcceleration;

	private double horseStamina;

	private boolean isRoomOwner;
}
