package com.example.grandehorse.domain.trading.controller.response;

import java.time.LocalDateTime;

import com.example.grandehorse.domain.horse.entity.CoatColor;
import com.example.grandehorse.domain.horse.entity.HorseRank;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SoldCardResponse {
	private Integer tradeId;

	private String horseId;

	private String coatColor;

	private String name;

	private String horseRank;

	private Integer price;

	private Double speed;

	private Double acceleration;

	private Double stamina;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm")
	private LocalDateTime soldAt;
	public SoldCardResponse(
		Integer tradeId,
		String horseId,
		CoatColor coatColor,
		String name,
		HorseRank horseRank,
		Integer price,
		Double speed,
		Double acceleration,
		Double stamina,
		LocalDateTime soldAt
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
		this.soldAt = soldAt;
	}
}
