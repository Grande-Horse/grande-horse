package com.example.grandehorse.global.redis.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
public class CashOrderRedisDto implements Serializable {
	private int userId;
	private Byte productId;
	private String name;
	private int price;
	private int acquiredCoin;
	private LocalDateTime orderedAt;
}
