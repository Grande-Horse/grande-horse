package com.example.grandehorse.global.filter;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.grandehorse.domain.auth.service.TokenBlacklistService;
import com.example.grandehorse.global.exception.AuthException;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.jwt.JwtTokenProvider;
import com.example.grandehorse.global.util.CookieUtil;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtTokenProvider jwtProvider;
	private final TokenBlacklistService tokenBlacklistService;

	private static final List<String> EXCLUDED_URLS = List.of(
		"/api/v1/auth/test",
		"/api/v1/auth/login-kakao",
		"/api/v1/auth/login-ssafy",
		"/api/v1/users"
	);

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String requestUri = request.getRequestURI();
		return EXCLUDED_URLS.stream().anyMatch(requestUri::startsWith);
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		String accessToken = getAccessToken(request, response);
		validateToken(accessToken);

		String userId = jwtProvider.getIdFromToken(accessToken);
		request.setAttribute("userId", userId);

		filterChain.doFilter(request, response);
	}

	private String getAccessToken(HttpServletRequest request, HttpServletResponse response) {
		return CookieUtil.getValue(request, "accessToken")
			.orElseGet(() -> regenerateAccessToken(request, response));
	}

	private String regenerateAccessToken(HttpServletRequest request, HttpServletResponse response) {
		String refreshToken = CookieUtil.getValue(request, "refreshToken")
			.orElseThrow(() -> new AuthException(CustomError.INVALID_TOKEN));

		validateToken(refreshToken);

		String id = jwtProvider.getIdFromToken(refreshToken);
		String newAccessToken = jwtProvider.generateAccessToken(id);
		CookieUtil.createAccessTokenCookie(response, newAccessToken);

		return newAccessToken;
	}

	private void validateToken(String token) {
		jwtProvider.validateToken(token);
		tokenBlacklistService.validateTokenBlacklisted(token);
	}
}

