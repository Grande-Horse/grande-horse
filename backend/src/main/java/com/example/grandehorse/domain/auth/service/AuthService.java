package com.example.grandehorse.domain.auth.service;

import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.auth.client.KakaoApiClient;
import com.example.grandehorse.domain.auth.client.SsafyApiClient;
import com.example.grandehorse.domain.auth.controller.response.SocialUserResponse;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.jwt.JwtTokenProvider;
import com.example.grandehorse.global.util.CookieUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final JwtTokenProvider jwtTokenProvider;
	private final SsafyApiClient ssafyApiClient;
	private final KakaoApiClient kakaoApiClient;
	private final UserService userService;

	@Value("${FRONT_URL}")
	private String frontUrl;

	public String getSsafyLoginUrl() {
		return ssafyApiClient.ssafyLoginUrl();
	}

	public String getKakaoLoginUrl() {
		return kakaoApiClient.kakaoLoginUrl();
	}

	public String processSsafyUserAuthentication(String code, HttpServletResponse response) {
		String accessToken = ssafyApiClient.getAccessToken(code);
		SocialUserResponse socialUserResponse = ssafyApiClient.getUserInfo(accessToken);

		return userService.findUserBySocialInfo(socialUserResponse)
			.map(user -> redirectForAuthenticatedUser(user.getId(), response))
			.orElseGet(() -> redirectForNewUserRegistration(socialUserResponse, response));
	}

	public String processKakaoUserAuthentication(String code, HttpServletResponse response) {
		String accessToken = kakaoApiClient.getAccessToken(code);
		SocialUserResponse socialUserResponse = kakaoApiClient.getUserInfo(accessToken);

		return userService.findUserBySocialInfo(socialUserResponse)
			.map(user -> redirectForAuthenticatedUser(user.getId(), response))
			.orElseGet(() -> redirectForNewUserRegistration(socialUserResponse, response));
	}


	private String redirectForAuthenticatedUser(int userId, HttpServletResponse response) {
		CookieUtil.createAccessTokenCookie(
			response,
			jwtTokenProvider.generateAccessToken(userId)
		);
		CookieUtil.createRefreshTokenCookie(
			response,
			jwtTokenProvider.generateRefreshToken(userId)
		);
		return frontUrl;
	}

	private String redirectForNewUserRegistration(SocialUserResponse socialUserResponse, HttpServletResponse response) {
		CookieUtil.createSocialTokenCookie(
			response,
			jwtTokenProvider.generateSocialToken(Map.of(
				"socialProvider", socialUserResponse.getSocialProvider(),
				"socialId", socialUserResponse.getSocialId(),
				"email", socialUserResponse.getEmail()
			))
		);
		return frontUrl + "/register";
	}
}
