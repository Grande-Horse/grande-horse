package com.example.grandehorse.domain.auth.service;

import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.auth.client.OauthApiClient;
import com.example.grandehorse.domain.auth.controller.request.SocialAuthorizationDto;
import com.example.grandehorse.domain.auth.controller.response.SocialUserResponse;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.jwt.JwtTokenProvider;
import com.example.grandehorse.global.response.CommonResponse;
import com.example.grandehorse.global.util.CookieUtil;

import lombok.RequiredArgsConstructor;

@Service
public class AuthService {
	private final static String HOME_URL = "/";
	private final static String REGISTER_URL = "/register";
	private final JwtTokenProvider jwtTokenProvider;
	private final Map<String, OauthApiClient> oauthClients;
	private final UserService userService;

	public AuthService(
		JwtTokenProvider jwtTokenProvider,
		@Qualifier("oauthClients") Map<String, OauthApiClient> oauthClients,
		UserService userService
	) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.oauthClients = oauthClients;
		this.userService = userService;
	}

	public String getLoginUrl(String social) {
		OauthApiClient oauthApiClient = oauthClients.get(social);
		return oauthApiClient.getLoginUrl();
	}

	public ResponseEntity<CommonResponse<Map>> processUserAuthentication(
		SocialAuthorizationDto socialAuthorizationDto,
		HttpServletResponse response
	) {
		OauthApiClient oauthApiClient = oauthClients.get(socialAuthorizationDto.getSocialProvider().toString());
		String accessToken = oauthApiClient.getAccessToken(socialAuthorizationDto.getCode());
		SocialUserResponse socialUserResponse = oauthApiClient.getUserInfo(accessToken);

		String redirectUrl = userService.findUserBySocialInfo(socialUserResponse)
			.map(user -> redirectForAuthenticatedUser(user.getId(), response))
			.orElseGet(() -> redirectForNewUserRegistration(socialUserResponse, response));

		return CommonResponse.success(Map.of("redirectUrl", redirectUrl));
	}

	private String redirectForAuthenticatedUser(int userId, HttpServletResponse response) {
		CookieUtil.createAccessTokenCookie(response, jwtTokenProvider.generateAccessToken(userId));
		CookieUtil.createRefreshTokenCookie(response, jwtTokenProvider.generateRefreshToken(userId));
		return HOME_URL;
	}

	private String redirectForNewUserRegistration(
		SocialUserResponse socialUserResponse,
		HttpServletResponse response
	) {
		CookieUtil.createSocialTokenCookie(response, jwtTokenProvider.generateSocialToken(Map.of(
			"socialProvider", socialUserResponse.getSocialProvider(),
			"socialId", socialUserResponse.getSocialId(),
			"email", socialUserResponse.getEmail()
		)));
		return REGISTER_URL;
	}
}
