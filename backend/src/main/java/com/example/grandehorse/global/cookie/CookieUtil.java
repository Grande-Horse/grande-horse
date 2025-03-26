package com.example.grandehorse.global.cookie;

import java.util.Optional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
	private static final int SOCIALTOKEN_MAX_AGE = 300; // 5분
	private static final int ACCESSTOKEN_MAX_AGE = 1_800; // 30분
	private static final int REFRESHTOKEN_MAX_AGE = 604_800; // 1주일

	/**
	 * 쿠키 생성 메서드
	 * @param response 쿠키 담을 응답 객체
	 * @param name 쿠키 이름
	 * @param value 쿠키 값
	 * @param maxAge 쿠키 유지시간(초)
	 */
	public void createCookie(HttpServletResponse response, String name, String value, int maxAge) {
		Cookie cookie = new Cookie(name, value);
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setPath("/");
		cookie.setMaxAge(maxAge);
		response.addCookie(cookie);
	}

	/**
	 * 쿠키 조회 메서드
	 * @param request 쿠키 꺼낼 요청 객체
	 * @param name 조회할 쿠키 이름
	 * @return 쿠키(Optional객체)
	 */
	public Optional<Cookie> getCookie(HttpServletRequest request, String name) {
		Cookie[] cookies = request.getCookies();

		if (cookies == null) {
			return Optional.empty();
		}

		for (Cookie cookie : cookies) {
			if (cookie.getName().equals(name)) {
				return Optional.of(cookie);
			}
		}
		return Optional.empty();
	}

	/**
	 * 쿠키 값 조회 메서드
	 * @param request 쿠키 꺼낼 요청 객체
	 * @param name 조회할 쿠키 이름
	 * @return 쿠키 값
	 */
	public Optional<String> getValue(HttpServletRequest request, String name) {
		Cookie cookie = getCookie(request, name).orElse(null);
		return cookie == null ? Optional.empty() : Optional.of(cookie.getValue());
	}

	/**
	 * 쿠키 삭제 메서드
	 * @param response 쿠키 담을 응답 객체
	 * @param name 삭제할 쿠키 이름
	 */
	public void deleteCookie(HttpServletResponse response, String name) {
		Cookie cookie = new Cookie(name, "");
		cookie.setPath("/");
		cookie.setMaxAge(0); // 유효기간을 0으로 설정하여 삭제
		response.addCookie(cookie);
	}

	/**
	 * accessToken 쿠키 생성 메서드
	 * @param response 쿠키 담을 응답 객체
	 * @param value 쿠키 값
	 */
	public void createAccessTokenCookie(HttpServletResponse response, String value) {
		createCookie(response, "accessToken", value, ACCESSTOKEN_MAX_AGE);
	}

	/**
	 * refreshToken 쿠키 생성 메서드
	 * @param response 쿠키 담을 응답 객체
	 * @param value 쿠키 값
	 */
	public void createRefreshTokenCookie(HttpServletResponse response, String value) {
		createCookie(response, "refreshToken", value, REFRESHTOKEN_MAX_AGE);
	}

	/**
	 * socialToken 쿠키 생성 메서드
	 * @param response 쿠키 담을 응답 객체
	 * @param value 쿠키 값
	 */
	public void createSocialTokenCookie(HttpServletResponse response, String value) {
		createCookie(response, "socialToken", value, SOCIALTOKEN_MAX_AGE);
	}
}
