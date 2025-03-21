package com.example.grandehorse.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class RaceException extends RuntimeException {
	private final HttpStatus status;
	private final String errorCode;

	public RaceException(CustomError customError) {
		super(customError.getErrorMessage());
		this.status = customError.getHttpStatus();
		this.errorCode = customError.getErrorCode();
	}
}
