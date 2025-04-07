package com.example.grandehorse.domain.card.controller.response;

import com.example.grandehorse.domain.horse.entity.CoatColor;
import com.example.grandehorse.domain.horse.entity.HorseRank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CardResponseDto {
	private int cardId;

	private String horseId;

	private byte status;

	private CoatColor coatColor;

	private String name;

	private HorseRank horseRank;

	private short weight;

	private double speed;

	private double acceleration;

	private double stamina;
}
