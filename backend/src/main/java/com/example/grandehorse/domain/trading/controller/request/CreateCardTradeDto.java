package com.example.grandehorse.domain.trading.controller.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCardTradeDto {
	@NotNull(message = "horseId는 반드시 존재해야 합니다.")
	@Length(min = 7, max = 7, message = "horseId는 7글자여야합니다.")
	private String horseId;

	@NotNull(message = "cardId는 반드시 존재해야 합니다.")
	@Min(value = 1, message = "cardId는 0보다 커야 합니다.")
	private int cardId;

	@Min(value = 0, message = "price는 음수일 수 없습니다.")
	private int price;
}
