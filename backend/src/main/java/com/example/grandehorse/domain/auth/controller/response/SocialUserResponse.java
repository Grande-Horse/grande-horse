package com.example.grandehorse.domain.auth.controller.response;

import com.example.grandehorse.domain.user.entity.SocialProvider;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialUserResponse {
	private SocialProvider socialProvider;
	private String socialId;
	private String email;
}
