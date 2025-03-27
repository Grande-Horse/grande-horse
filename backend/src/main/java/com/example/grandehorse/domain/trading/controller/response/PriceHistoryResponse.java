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
public class PriceHistoryResponse {
	private int highestPrice;

	private int averagePrice;

	private int lowestPrice;

	private LocalDateTime soldAt;
}
