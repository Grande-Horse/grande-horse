package com.example.grandehorse.domain.auth.service;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.example.grandehorse.global.exception.AuthException;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.jwt.JwtTokenProvider;

@Service
public class TokenBlacklistService {
	private static final String BLACKLIST_PREFIX = "blacklist:";

	private final RedisTemplate<String, Object> redisTemplate;
	private final JwtTokenProvider jwtTokenProvider;

	public TokenBlacklistService(
		@Qualifier("defaultRedisTemplate") RedisTemplate<String, Object> redisTemplate,
		JwtTokenProvider jwtTokenProvider
	) {
		this.redisTemplate = redisTemplate;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	public void addTokenToBlacklist(String token) {
		long expiration = (jwtTokenProvider.getExpiration(token) - System.currentTimeMillis()) / 1000;
		if (expiration > 0) {
			String key = BLACKLIST_PREFIX + token;
			redisTemplate.opsForValue()
				.set(key, "true", expiration, TimeUnit.SECONDS);
		}
	}

	public void validateTokenBlacklisted(String token) {
		String key = BLACKLIST_PREFIX + token;
		if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
			throw new AuthException(CustomError.BLACKLISTED_TOKEN);
		}
	}
}

