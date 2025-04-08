package com.example.grandehorse.global.config;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.grandehorse.global.external.oauth.OauthApiClient;

@Configuration
public class OAuthClientConfig {

	@Bean
	public Map<String, OauthApiClient> oauthClients(List<OauthApiClient> clients) {
		return clients.stream()
			.collect(Collectors.toMap(
				OauthApiClient::getProvider,
				Function.identity()
			));
	}
}

