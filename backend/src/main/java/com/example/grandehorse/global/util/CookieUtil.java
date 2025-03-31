package com.example.grandehorse.global.util;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
	private static final int SOCIALTOKEN_MAX_AGE = 300; // 5분
	private static final int ACCESSTOKEN_MAX_AGE = 1_800; // 30분
	private static final int REFRESHTOKEN_MAX_AGE = 604_800; // 1주일

	private static void createCookie(HttpServletResponse response, String name, String value, int maxAge) {
		ResponseCookie cookie = ResponseCookie.from(name, value)
			.httpOnly(true)
			.secure(true)
			.path("/")
			.sameSite("None")
			.maxAge(Duration.ofSeconds(maxAge))
			.build();

		response.addHeader("Set-Cookie", cookie.toString());
	}

	public static Optional<String> getValue(HttpServletRequest request, String name) {
		if (request.getCookies() == null) return Optional.empty();
		return Arrays.stream(request.getCookies())
			.filter(cookie -> cookie.getName().equals(name))
			.map(cookie -> cookie.getValue())
			.findFirst();
	}

	public static void deleteCookie(HttpServletResponse response, String name) {
		ResponseCookie cookie = ResponseCookie.from(name, "")
			.httpOnly(true)
			.secure(true)
			.path("/")
			.sameSite("None")
			.maxAge(0)
			.build();

		response.addHeader("Set-Cookie", cookie.toString());
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
