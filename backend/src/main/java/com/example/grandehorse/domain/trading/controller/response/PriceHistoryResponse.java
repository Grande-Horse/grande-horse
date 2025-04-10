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
		Object date
	) {
		this.highestPrice = highestPrice;
		this.averagePrice = averagePrice == null ? 0 : (int)Math.round(averagePrice);
		this.lowestPrice = lowestPrice;

		if (date instanceof Date) {
			this.date = ((Date)date).toLocalDate();
		} else if (date instanceof LocalDate) {
			this.date = (LocalDate)date;
		} else {
			throw new IllegalArgumentException(
				"Unsupported date type: " + (date != null ? date.getClass().getName() : "null"));
		}
	}
}
