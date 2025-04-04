package com.example.grandehorse.domain.product.controller.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class PaymentInfoDto {
	private final String impUid;
	private final String merchantUid;

	@JsonCreator
	public PaymentInfoDto(
		@JsonProperty String impUid,
		@JsonProperty String merchantUid
	) {
		this.impUid = impUid;
		this.merchantUid = merchantUid;
	}
}
