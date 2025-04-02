package com.example.grandehorse.domain.auth.client;

import com.example.grandehorse.domain.auth.controller.response.SocialUserResponse;

public interface OauthApiClient {
	String getLoginUrl();

	String getAccessToken(String code);

	SocialUserResponse getUserInfo(String accessToken);

	String getProvider();
}
