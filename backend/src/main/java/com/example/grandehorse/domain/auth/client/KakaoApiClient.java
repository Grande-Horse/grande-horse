package com.example.grandehorse.domain.auth.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.example.grandehorse.domain.auth.controller.response.SocialUserResponse;
import com.example.grandehorse.domain.user.entity.SocialProvider;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.ExternalApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class KakaoApiClient implements OauthApiClient {
	private final ExternalApiClient externalApiClient;
	private final ObjectMapper objectMapper;

	@Value("${KAKAO_CLIENT_ID}")
	private String kakaoClientId;
	@Value("${KAKAO_REDIRECT_URI}")
	private String kakaoRedirectUri;

	public String getLoginUrl() {
		StringBuffer url = new StringBuffer();
		url.append("https://kauth.kakao.com/oauth/authorize?");
		url.append("client_id=").append(kakaoClientId);
		url.append("&redirect_uri=").append(kakaoRedirectUri);
		url.append("&response_type=code");
		System.out.println(url.toString());
		return url.toString();
	}

	public String getAccessToken(String code) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

			MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
			body.add("grant_type", "authorization_code");
			body.add("client_id", kakaoClientId);
			body.add("redirect_uri", kakaoRedirectUri);
			body.add("code", code);

			ResponseEntity<String> response = externalApiClient.post(
				"https://kauth.kakao.com/oauth/token",
				headers,
				body);

			JsonNode jsonNode = objectMapper.readTree(response.getBody());
			return jsonNode.get("access_token").asText();
		} catch (Exception e) {
			throw new ExternalApiException(CustomError.EXTERNAL_SERVICE_PARSE_ERROR);
		}
	}

	public SocialUserResponse getUserInfo(String accessToken) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + accessToken);

			ResponseEntity<String> response = externalApiClient.get("https://kapi.kakao.com/v2/user/me", headers);

			JsonNode jsonNode = objectMapper.readTree(response.getBody());

			String userId = jsonNode.get("id").asText();
			JsonNode kakaoAccountNode = jsonNode.get("kakao_account");
			String email = kakaoAccountNode.get("email").asText();
			return new SocialUserResponse(
				SocialProvider.KAKAO,
				userId,
				email
			);
		} catch (Exception e) {
			throw new ExternalApiException(CustomError.EXTERNAL_SERVICE_PARSE_ERROR);
		}
	}

	@Override
	public String getProvider() {
		return SocialProvider.KAKAO.toString();
	}
}
