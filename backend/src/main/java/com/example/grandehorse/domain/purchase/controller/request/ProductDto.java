package com.example.grandehorse.domain.purchase.controller.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class ProductDto {

	@NotNull(message = "id는 반드시 존재해야 합니다.")
	@Min(value = -128)
	@Max(value = 127)
	private final Byte id;

	@JsonCreator
	public ProductDto(
		@JsonProperty("id") Byte id
	) {
		this.id = id;
	}
}
