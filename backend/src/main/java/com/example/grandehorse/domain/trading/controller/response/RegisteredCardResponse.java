package com.example.grandehorse.domain.trading.controller.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisteredCardResponse {
	private int tradeId;

	private String coatColor;

	private String name;

	private String horseRank;

	private int price;

	private double speed;

	private double acceleration;

	private double stamina;

	private LocalDateTime registeredAt;
}
