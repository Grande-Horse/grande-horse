package com.example.grandehorse.domain.trading.controller.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RegisteredCardResponse {
	private int tradeId;

	private int horseId;

	private String coatColor;

	private String name;

	private String horseRank;

	private int price;

	private double speed;

	private double acceleration;

	private double stamina;

	private LocalDate registeredAt;

	public RegisteredCardResponse(
		int tradeId,
		int horseId,
		String coatColor,
		String name,
		String horseRank,
		int price,
		double speed,
		double acceleration,
		double stamina,
		LocalDateTime registeredAt
	) {
		this.tradeId = tradeId;
		this.horseId = horseId;
		this.coatColor = coatColor.toLowerCase();
		this.name = name;
		this.horseRank = horseRank.toLowerCase();
		this.price = price;
		this.speed = speed;
		this.acceleration = acceleration;
		this.stamina = stamina;
		this.registeredAt = registeredAt.toLocalDate();
	}
}
