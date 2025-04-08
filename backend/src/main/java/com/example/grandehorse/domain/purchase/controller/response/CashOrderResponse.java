package com.example.grandehorse.domain.purchase.controller.response;

import java.time.LocalDateTime;

import com.example.grandehorse.global.redis.dto.CashOrderRedisDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CashOrderResponse {
	private String merchantUid;
	private String name;
	private int amount;
	private LocalDateTime orderedAt;

	public static CashOrderResponse fromCashOrderRedisDto(String merchantUid, CashOrderRedisDto cashOrderRedisDto) {
		return CashOrderResponse.builder()
			.merchantUid(merchantUid)
			.name(cashOrderRedisDto.getName())
			.amount(cashOrderRedisDto.getPrice())
			.orderedAt(cashOrderRedisDto.getOrderedAt())
			.build();
	}
}
