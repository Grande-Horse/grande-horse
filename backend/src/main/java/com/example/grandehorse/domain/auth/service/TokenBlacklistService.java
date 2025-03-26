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
	private final RedisTemplate<String, Object> redisTemplate;
	private final JwtTokenProvider jwtTokenProvider;

	private static final String BLACKLIST_PREFIX = "blacklist:";

	public TokenBlacklistService(
		@Qualifier("tokenBrackListRedisTemplate") RedisTemplate<String, Object> redisTemplate,
		JwtTokenProvider jwtTokenProvider
	) {
		this.redisTemplate = redisTemplate;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	/**
	 * 블랙리스트 추가 메서드
	 * @param token 토큰(JWT 토큰)
	 */
	public void addTokenToBlacklist(String token) {
		long expiration = (jwtTokenProvider.getExpiration(token) - System.currentTimeMillis()) / 1000;
		if (expiration > 0) {
			String key = BLACKLIST_PREFIX + token;
			redisTemplate.opsForValue().set(key, "true", expiration, TimeUnit.SECONDS);
		}
	}

	/**
	 * 토큰이 블랙리스트에 존재하는지 체크 메서드
	 * @param token 토큰
	 * @return 블랙리스트에 존재하면 true, 존재하지 않으면 false
	 */
	public void validateTokenBlacklisted(String token) {
		String key = BLACKLIST_PREFIX + token;
		if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
			throw new AuthException(CustomError.BLACKLISTED_TOKEN);
		}
	}
}
