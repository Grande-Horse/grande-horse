package com.example.grandehorse.domain.card.controller.request;

import java.util.List;

import lombok.Data;

@Data
public class CombineRequestDto {
	private List<Integer> cardIds;
}
