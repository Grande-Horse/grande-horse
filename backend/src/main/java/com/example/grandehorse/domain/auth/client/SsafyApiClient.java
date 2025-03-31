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
public class SsafyApiClient implements OauthApiClient{
	private final ExternalApiClient externalApiClient;
	private final ObjectMapper objectMapper;

	@Value("${SSAFY_CLIENT_ID}")
	private String ssafyClientId;
	@Value("${SSAFY_REDIRECT_URI}")
	private String ssafyRedirectUri;
	@Value("${SSAFY_SECRET}")
	private String ssafySecret;

	public String getLoginUrl() {
		StringBuffer url = new StringBuffer();
		url.append("https://project.ssafy.com/oauth/sso-check?");
		url.append("client_id=").append(ssafyClientId);
		url.append("&redirect_uri=").append(ssafyRedirectUri);
		url.append("&response_type=code");
		return url.toString();
	}

	public String getAccessToken(String code) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

			MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
			body.add("grant_type", "authorization_code");
			body.add("client_id", ssafyClientId);
			body.add("client_secret", ssafySecret);
			body.add("redirect_uri", ssafyRedirectUri);
			body.add("code", code);

			ResponseEntity<String> response = externalApiClient.post(
				"https://project.ssafy.com/ssafy/oauth2/token",
				headers,
				body
			);

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

			ResponseEntity<String> response = externalApiClient.get(
				"https://project.ssafy.com/ssafy/resources/userInfo", headers
			);

			JsonNode jsonNode = objectMapper.readTree(response.getBody());
			return new SocialUserResponse(
				SocialProvider.SSAFY,
				jsonNode.get("userId").asText(),
				jsonNode.get("email").asText()
			);
		} catch (Exception e) {
			throw new ExternalApiException(CustomError.EXTERNAL_SERVICE_PARSE_ERROR);
		}
	}

	@Override
	public String getProvider() {
		return SocialProvider.SSAFY.toString();
	}
}
