package com.example.grandehorse.domain.user.controller.request;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class SignUpDto {
	private String nickname;

	@JsonCreator
	public SignUpDto(@JsonProperty("nickname") String nickname) {
		this.nickname = nickname;
	}
}
