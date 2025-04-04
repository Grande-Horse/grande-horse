package com.example.grandehorse.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class PurchaseException extends RuntimeException {
	private final HttpStatus status;
	private final String errorCode;

	public PurchaseException(CustomError customError) {
		super(customError.getErrorMessage());
		this.status = customError.getHttpStatus();
		this.errorCode = customError.getErrorCode();
	}
}
