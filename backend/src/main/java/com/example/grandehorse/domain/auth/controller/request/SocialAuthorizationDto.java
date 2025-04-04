package com.example.grandehorse.domain.auth.controller.request;

import com.example.grandehorse.domain.user.entity.SocialProvider;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;

@Getter
public class SocialAuthorizationDto {
	private SocialProvider socialProvider;
	private String code;

	@JsonCreator
	public SocialAuthorizationDto(@JsonProperty SocialProvider socialProvider, @JsonProperty String code) {
		this.socialProvider = socialProvider;
		this.code = code;
	}
}
