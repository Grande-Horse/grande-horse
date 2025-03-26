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
import com.example.grandehorse.global.cookie.CookieUtil;
import com.example.grandehorse.global.exception.AuthException;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final CookieUtil cookieUtil;
	private final JwtTokenProvider jwtProvider;
	private final TokenBlacklistService tokenBlacklistService;

	private static final List<String> EXCLUDED_URLS = List.of(
		"/api/v1/auth/test",
		"/api/v1/auth/login-kakao",
		"/api/v1/auth/login-ssafy",
		"/api/v1/users"
	);

	/**
	 * 특정 URL을 필터링하지 않도록 설정 하는 메서드
	 *
	 * @param request 현재 요청 객체
	 * @return true일 경우 필터링을 하지 않음
	 */
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
		String requestUri = request.getRequestURI();
		return EXCLUDED_URLS.stream().anyMatch(requestUri::startsWith);
	}

	/**
	 * JWT 인증 필터
	 * - AccessToken이 유효하지 않을 경우 RefreshToken을 이용하여 재발급을 시도
	 * - 유효한 AccessToken을 얻은 후 요청에 userId를 추가
	 *
	 * @param request     요청 객체
	 * @param response    응답 객체
	 * @param filterChain 필터 체인 객체
	 * @throws ServletException 서블릿 오류 발생 시
	 * @throws IOException      I/O 오류 발생 시
	 */
	@Override
	protected void doFilterInternal(
		HttpServletRequest request,
		HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {

		String accessToken = cookieUtil.getValue(request, "accessToken").orElseGet(() -> {
			String refreshToken = cookieUtil.getValue(request, "refreshToken")
				.orElseThrow(() -> new AuthException(CustomError.INVALID_TOKEN));

			jwtProvider.validateToken(refreshToken);
			tokenBlacklistService.validateTokenBlacklisted(refreshToken);

			String id = jwtProvider.getIdFromToken(refreshToken);
			String newAccessToken = jwtProvider.generateAccessToken(id);
			cookieUtil.createAccessTokenCookie(response, newAccessToken);
			return newAccessToken;
		});

		jwtProvider.validateToken(accessToken);
		tokenBlacklistService.validateTokenBlacklisted(accessToken);

		String userId = jwtProvider.getIdFromToken(accessToken);
		request.setAttribute("userId", userId);

		filterChain.doFilter(request, response);
	}
}

