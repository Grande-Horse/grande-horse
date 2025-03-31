package com.example.grandehorse.domain.trading.controller.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TradeCardResponse {
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

	public TradeCardResponse(
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
