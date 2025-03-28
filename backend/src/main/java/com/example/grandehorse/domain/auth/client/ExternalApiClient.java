package com.example.grandehorse.domain.auth.client;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExternalApiClient {
	private final RestTemplate restTemplate;

	public ResponseEntity<String> post(String url, HttpHeaders headers, MultiValueMap<String, String> body) {
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
		return restTemplate.exchange(url, HttpMethod.POST, request, String.class);
	}

	public ResponseEntity<String> get(String url, HttpHeaders headers) {
		HttpEntity<String> request = new HttpEntity<>(headers);
		return restTemplate.exchange(url, HttpMethod.GET, request, String.class);
	}
}
