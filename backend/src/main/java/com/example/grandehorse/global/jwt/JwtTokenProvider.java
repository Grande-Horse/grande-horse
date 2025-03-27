package com.example.grandehorse.global.jwt;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.grandehorse.global.exception.AuthException;
import com.example.grandehorse.global.exception.CustomError;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenProvider {
	private static final int SOCIALTOKEN_EXPIRATION = 5; // 5분
	private static final int ACCESSTOKEN_EXPIRATION = 30; // 30분
	private static final int REFRESHTOKEN_EXPIRATION = 43_200; // 30주일

	@Value("${JWT_SECRETKEY}")
	private String secretKey;

	public String generateJwt(Map<String, Object> payload, int expiration) {
		Claims claims = Jwts.claims();
		claims.putAll(payload);

		return Jwts.builder()
			.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
			.setClaims(claims)
			.setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * expiration))
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}

	public void validateToken(String token) {
		try {
			Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token);
		} catch (Exception e) {
			throw new AuthException(CustomError.INVALID_TOKEN);
		}
	}

	private Claims getClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody();
	}

	public int getIdFromToken(String token) {
		Claims claims = getClaims(token);
		return claims.get("id", Integer.class);
	}

	public Map<String, Object> getPayloadFromToken(String token) {
		Claims claims = getClaims(token);
		return new HashMap<>(claims);  // Immutable 형태로 반환
	}

	public long getExpiration(String token) {
		Claims claims = Jwts.parser()
			.setSigningKey(secretKey)
			.parseClaimsJws(token)
			.getBody();
		return claims.getExpiration().getTime();
	}

	public String generateAccessToken(int id) {
		String accessToken = generateJwt(
			Map.of("id", id),
			ACCESSTOKEN_EXPIRATION
		);
		log.info("Generated access token by {}: {}", id, accessToken);
		return accessToken;
	}

	public String generateRefreshToken(int id) {
		String refreshToken = generateJwt(
			Map.of("id", id),
			REFRESHTOKEN_EXPIRATION
		);
		log.info("Generated refresh token by {}: {}", id, refreshToken);
		return refreshToken;
	}

	public String generateSocialToken(Map<String, Object> payload) {
		String socialToken = generateJwt(
			payload,
			SOCIALTOKEN_EXPIRATION
		);
		log.info("Generated social token by {}: {}", payload.get("socialId"), socialToken);
		return socialToken;
	}
}
