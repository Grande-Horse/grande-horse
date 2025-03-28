package com.example.grandehorse.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class UserException extends RuntimeException {
	private final HttpStatus status;
	private final String errorCode;

	public UserException(CustomError customError) {
		super(customError.getErrorMessage());
		this.status = customError.getHttpStatus();
		this.errorCode = customError.getErrorCode();
	}
}
