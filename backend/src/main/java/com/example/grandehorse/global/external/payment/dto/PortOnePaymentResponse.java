package com.example.grandehorse.global.external.payment.dto;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class PortOnePaymentResponse {
	private final String impUid;
	private final String merchantUid;
	private final String payMethod;
	private final int amount;
	private final boolean paid;

	public static PortOnePaymentResponse fromResponse(JsonNode response) {
		return PortOnePaymentResponse.builder()
			.impUid(response.get("imp_uid").asText())
			.merchantUid(response.get("merchant_uid").asText())
			.payMethod(response.get("pay_method").asText())
			.amount(response.get("amount").asInt())
			.paid(response.get("status").asText().equals("paid"))
			.build();
	}
}
