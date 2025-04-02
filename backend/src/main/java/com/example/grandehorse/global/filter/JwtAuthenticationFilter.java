package com.example.grandehorse.global.filter;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
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
	private static final List<String> EXCLUDED_URLS = List.of(
		"/api/v1/auth/**",
		"/api/v1/users/**"
	);
	private static final List<String> INCLUDED_URL_PATTERNS = List.of(
		"/api/v1/users/coin"
	);
	private static final AntPathMatcher pathMatcher = new AntPathMatcher();

	private final JwtTokenProvider jwtProvider;
	private final TokenBlacklistService tokenBlacklistService;


	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String requestUri = request.getRequestURI();

		return EXCLUDED_URLS.stream()
			.anyMatch(url -> pathMatcher.match(url, requestUri));
	}

	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain
	) throws ServletException, IOException {
		if (request.getMethod().equals("OPTIONS")) {
			response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
			response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
			response.setHeader(
				"Access-Control-Allow-Headers", "Authorization, Content-Type, Access-Control-Allow-Headers"
			);
			response.setHeader("Access-Control-Allow-Credentials", "true");
			response.setStatus(HttpServletResponse.SC_OK);
			return;
		}

		String accessToken = getAccessToken(request, response);
		validateToken(accessToken);

		int id = jwtProvider.getIdFromToken(accessToken);
		request.setAttribute("userId", id);

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

		int id = jwtProvider.getIdFromToken(refreshToken);
		String newAccessToken = jwtProvider.generateAccessToken(id);
		CookieUtil.createAccessTokenCookie(response, newAccessToken);

		return newAccessToken;
	}

	private void validateToken(String token) {
		jwtProvider.validateToken(token);
		tokenBlacklistService.validateTokenBlacklisted(token);
	}
}

