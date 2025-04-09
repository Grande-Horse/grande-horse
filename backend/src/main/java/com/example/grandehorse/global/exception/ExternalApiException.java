package com.example.grandehorse.global.exception;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.Getter;

@Getter
public class ExternalApiException extends RuntimeException {
	private final HttpStatus status;
	private final String errorCode;

	public ExternalApiException(CustomError customError) {
		super(customError.getErrorMessage());
		this.status = customError.getHttpStatus();
		this.errorCode = customError.getErrorCode();
	}
}
