package com.example.grandehorse.domain.trading.controller.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PriceHistoryResponse {
	private int highestPrice;

	private int averagePrice;

	private int lowestPrice;

	private LocalDate date;

	public PriceHistoryResponse(
		int highestPrice,
		int averagePrice,
		int lowestPrice,
		LocalDateTime date
	) {
		this.highestPrice = highestPrice;
		this.averagePrice = averagePrice;
		this.lowestPrice = lowestPrice;
		this.date = date.toLocalDate();
	}
}
