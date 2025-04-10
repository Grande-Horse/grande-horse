package com.example.grandehorse.domain.user.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SignInfoResponse {
	Boolean isSuccess;

	public static SignInfoResponse success() {
		return new SignInfoResponse(Boolean.TRUE);
	}

	public static SignInfoResponse fail() {
		return new SignInfoResponse(Boolean.FALSE);
	}
}
