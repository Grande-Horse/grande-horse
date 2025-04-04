package com.example.grandehorse.global.external.oauth;

import com.example.grandehorse.domain.auth.controller.response.SocialUserResponse;

public interface OauthApiClient {
	String getLoginUrl();

	String getAccessToken(String code);

	SocialUserResponse getUserInfo(String accessToken);

	String getProvider();
}
