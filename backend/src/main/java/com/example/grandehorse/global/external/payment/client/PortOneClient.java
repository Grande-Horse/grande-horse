package com.example.grandehorse.global.external.payment.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.ExternalApiException;
import com.example.grandehorse.global.external.ExternalApiClient;
import com.example.grandehorse.global.external.payment.dto.PortOnePaymentResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class PortOneClient {
	private final ExternalApiClient externalApiClient;
	private final ObjectMapper objectMapper;

	@Value(value = "${PORTONE_API_KEY}")
	private String impKey;
	@Value("${PORTONE_API_SECRET_KEY}")
	private String impSecretKey;

	public PortOnePaymentResponse getPortOnePayment(String impUid) {
		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(getAccessToken());

		String url = "https://api.iamport.kr/payments/" + impUid;
		JsonNode response = getResponseBodyFromGet(url, headers);
		return PortOnePaymentResponse.fromResponse(response);
	}

	public boolean cancelPayment(String impUid) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setBearerAuth(getAccessToken());

			Map<String, String> body = new HashMap<>();
			body.put("imp_uid", impUid);

			String url = "https://api.iamport.kr/payments/cancel";
			getResponseBodyFromPost(url, headers, body);
			return true;
		} catch (Exception e) {
			log.error("Error canceling portone payment {}", impUid);
		}
		return false;
	}

	private String getAccessToken() {
		HttpHeaders headers = new HttpHeaders();

		Map<String, String> body = new HashMap<>();
		body.put("imp_key", impKey);
		body.put("imp_secret", impSecretKey);

		String url = "https://api.iamport.kr/users/getToken";
		JsonNode response = getResponseBodyFromPost(url, headers, body);
		return response.get("access_token").asText();
	}

	private JsonNode getResponseBodyFromPost(String url, HttpHeaders headers, Map<String, String> body) {
		try {
			ResponseEntity<String> response = externalApiClient.postJson(url, headers, body);
			return objectMapper.readTree(response.getBody()).get("response");
		} catch (Exception e) {
			throw new ExternalApiException(CustomError.EXTERNAL_SERVICE_PARSE_ERROR);
		}
	}

	private JsonNode getResponseBodyFromGet(String url, HttpHeaders headers) {
		try {
			ResponseEntity<String> response = externalApiClient.get(url, headers);
			return objectMapper.readTree(response.getBody()).get("response");
		} catch (Exception e) {
			throw new ExternalApiException(CustomError.EXTERNAL_SERVICE_PARSE_ERROR);
		}
	}
}
