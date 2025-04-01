package com.example.grandehorse.domain.trading.controller.response;

import java.sql.Date;
import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PriceHistoryResponse {
	private Integer highestPrice;
	private Integer averagePrice;
	private Integer lowestPrice;
	private LocalDate date;

	public PriceHistoryResponse(
		Integer highestPrice,
		Double averagePrice,
		Integer lowestPrice,
		Date date
	) {
		this.highestPrice = highestPrice;
		this.averagePrice = (int)Math.round(averagePrice);
		this.lowestPrice = lowestPrice;
		this.date = date.toLocalDate();
	}

	public PriceHistoryResponse(
		Integer highestPrice,
		Double averagePrice,
		Integer lowestPrice,
		LocalDate date
	) {
		this.highestPrice = highestPrice;
		this.averagePrice = averagePrice == null ? 0 : (int)Math.round(averagePrice);
		this.lowestPrice = lowestPrice;
		this.date = date;
	}
}
