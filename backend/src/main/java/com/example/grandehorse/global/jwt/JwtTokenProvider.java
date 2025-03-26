package com.example.grandehorse.global.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.grandehorse.global.exception.AuthException;
import com.example.grandehorse.global.exception.CustomError;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtTokenProvider {
	private static final int SOCIALTOKEN_EXPIRATION = 5; // 5분
	private static final int ACCESSTOKEN_EXPIRATION = 30; // 30분
	private static final int REFRESHTOKEN_EXPIRATION = 43_200; // 30주일

	@Value("${JWT_SECRETKEY}")
	private String secretKey;

	public String generateJwt(String id, int expiration) {
		return Jwts.builder()
			.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
			.claim("id", id)
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

	public String getIdFromToken(String token) {
		Claims claims = getClaims(token);
		return claims.get("id", String.class);
	}

	public long getExpiration(String token) {
		Claims claims = Jwts.parser()
			.setSigningKey(secretKey)
			.parseClaimsJws(token)
			.getBody();
		return claims.getExpiration().getTime();
	}

	public String generateAccessToken(String id) {
		return generateJwt(id, ACCESSTOKEN_EXPIRATION);
	}

	public String generateRefreshToken(String id) {
		return generateJwt(id, REFRESHTOKEN_EXPIRATION);
	}

	public String generateSocialToken(String id) {
		return generateJwt(id, SOCIALTOKEN_EXPIRATION);
	}
}
