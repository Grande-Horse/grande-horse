package com.example.grandehorse.global.redis.service;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.grandehorse.global.redis.dto.CashOrderRedisDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CashOrderRedisService {
	@Qualifier("cashOrderRedisTemplate")
	private final RedisTemplate<String, CashOrderRedisDto> redisTemplate;
	private static final String PREFIX = "cash_order:";
	private static final int TIME = 10;
	private final ObjectMapper objectMapper;

	public void save(String merchantUid, CashOrderRedisDto dto) {
		String key = getKey(merchantUid);
		redisTemplate.opsForValue().set(key, dto, Duration.ofMinutes(TIME));
	}

	public Optional<CashOrderRedisDto> find(String paymentId) {
		Object rawValue = redisTemplate.opsForValue().get(getKey(paymentId));

		if (rawValue == null) {
			return Optional.empty();
		}

		if (rawValue instanceof LinkedHashMap) {
			return Optional.of(objectMapper.convertValue(rawValue, CashOrderRedisDto.class));
		}

		if (rawValue instanceof CashOrderRedisDto) {
			return Optional.of((CashOrderRedisDto)rawValue);
		}

		return Optional.empty();
	}

	public void delete(String paymentId) {
		redisTemplate.delete(getKey(paymentId));
	}

	private String getKey(String merchantUid) {
		return PREFIX + merchantUid;
	}
}
