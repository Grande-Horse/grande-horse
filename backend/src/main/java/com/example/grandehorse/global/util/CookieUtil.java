package com.example.grandehorse.global.util;

import java.util.Arrays;
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

	public static void createCookie(HttpServletResponse response, String name, String value, int maxAge) {
		Cookie cookie = new Cookie(name, value);
		cookie.setHttpOnly(true);
		cookie.setSecure(true);
		cookie.setPath("/");
		cookie.setMaxAge(maxAge);
		response.addCookie(cookie);
	}

	public static Optional<Cookie> getCookie(HttpServletRequest request, String name) {
		return Optional.ofNullable(request.getCookies())
			.stream()
			.flatMap(Arrays::stream)
			.filter(cookie -> cookie.getName().equals(name))
			.findFirst();
	}

	public static Optional<String> getValue(HttpServletRequest request, String name) {
		Cookie cookie = getCookie(request, name).orElse(null);
		return cookie == null ? Optional.empty() : Optional.of(cookie.getValue());
	}

	public static void deleteCookie(HttpServletResponse response, String name) {
		Cookie cookie = new Cookie(name, "");
		cookie.setPath("/");
		cookie.setMaxAge(0); // 유효기간을 0으로 설정하여 삭제
		response.addCookie(cookie);
	}

	public static void createAccessTokenCookie(HttpServletResponse response, String value) {
		createCookie(response, "accessToken", value, ACCESSTOKEN_MAX_AGE);
	}

	public static void createRefreshTokenCookie(HttpServletResponse response, String value) {
		createCookie(response, "refreshToken", value, REFRESHTOKEN_MAX_AGE);
	}

	public static void createSocialTokenCookie(HttpServletResponse response, String value) {
		createCookie(response, "socialToken", value, SOCIALTOKEN_MAX_AGE);
	}
}
