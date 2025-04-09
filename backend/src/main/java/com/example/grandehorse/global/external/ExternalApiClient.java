package com.example.grandehorse.global.external;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.ExternalApiException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExternalApiClient {
	private final RestTemplate restTemplate;
	private final ObjectMapper objectMapper; // JSON 변환용

	public ResponseEntity<String> postFormUrlEncoded(String url, HttpHeaders headers,
		MultiValueMap<String, String> body) {
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
		return restTemplate.exchange(url, HttpMethod.POST, request, String.class);
	}

	public ResponseEntity<String> postJson(String url, HttpHeaders headers, Map<String, String> body) {
		headers.setContentType(MediaType.APPLICATION_JSON);

		String jsonBody;
		try {
			jsonBody = objectMapper.writeValueAsString(body);
		} catch (JsonProcessingException e) {
			throw new ExternalApiException(CustomError.EXTERNAL_SERVICE_PARSE_ERROR);
		}

		HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);
		return restTemplate.exchange(url, HttpMethod.POST, request, String.class);
	}

	public ResponseEntity<String> get(String url, HttpHeaders headers) {
		HttpEntity<String> request = new HttpEntity<>(headers);
		return restTemplate.exchange(url, HttpMethod.GET, request, String.class);
	}
}
