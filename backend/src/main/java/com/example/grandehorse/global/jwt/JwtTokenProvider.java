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

	/**
	 * JWT 발급 메서드
	 * @param id 페이로드에 저장할 id 값
	 * @param expiration 유효 시간(분)
	 * @return 새로운 JWT 토큰
	 */
	public String generateJwt(String id, int expiration) {
		return Jwts.builder()
			.setHeaderParam(Header.TYPE, Header.JWT_TYPE)
			.claim("id", id)
			.setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * expiration))
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}

	/**
	 * JWT Token 검증 메서드
	 * @param token JWT 토큰
	 * @throws AuthException 유효하지 않은 토큰일 경우 발생
	 */
	public void validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
		} catch (Exception e) {
			throw new AuthException(CustomError.INVALID_TOKEN);
		}
	}

	/**
	 * JWT Token Claims(페이로드) 정보 파싱 메서드
	 * @param token
	 * @return JWT 토큰의 페이로드
	 */
	private Claims getClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).getBody();
	}

	/**
	 * JWT Token Claims(페이로드) 정보에서 id 값 추출 메서드
	 * @param token
	 * @return 페이로드에서 추출한 id 값
	 */
	public String getIdFromToken(String token) {
		Claims claims = getClaims(token);
		return claims.get("id", String.class);
	}

	/**
	 * 토큰에서 만료 시간을 추출
	 * @param token JWT 토큰
	 * @return 만료 시간 (밀리초)
	 */
	public long getExpiration(String token) {
		Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
		return claims.getExpiration().getTime();
	}

	/**
	 * accessToken 생성
	 * @param id
	 * @return jwt 토큰
	 */
	public String generateAccessToken(String id) {
		return generateJwt(id, ACCESSTOKEN_EXPIRATION);
	}

	/**
	 * refreshToken 생성
	 * @param id
	 * @return jwt 토큰
	 */
	public String generateRefreshToken(String id) {
		return generateJwt(id, REFRESHTOKEN_EXPIRATION);
	}

	/**
	 * socialToken 생성
	 * @param id
	 * @return jwt 토큰
	 */
	public String generateSocialToken(String id) {
		return generateJwt(id, SOCIALTOKEN_EXPIRATION);
	}
}
