package com.example.grandehorse.domain.card.controller.response;

import com.example.grandehorse.domain.horse.entity.CoatColor;
import com.example.grandehorse.domain.horse.entity.HorseRank;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
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

	public CardResponseDto(
		int cardId,
		String horseId,
		byte status,
		CoatColor coatColor,
		String name,
		HorseRank horseRank,
		short weight,
		double speed,
		double acceleration,
		double stamina
	) {
		this.cardId = cardId;
		this.horseId = horseId;
		this.status = status;
		this.coatColor = coatColor;
		this.name = name;
		this.horseRank = horseRank;
		this.weight = weight;
		this.speed = speed;
		this.acceleration = acceleration;
		this.stamina = stamina;
	}

}
