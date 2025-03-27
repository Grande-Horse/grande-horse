package com.example.grandehorse.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.grandehorse.global.response.CommonResponse;
import com.fasterxml.jackson.core.JsonProcessingException;

import lombok.extern.slf4j.Slf4j;

/**
 * 기본적인 커스텀 예외 클래스에 대한 핸들러는 모두 작성해두었습니다.
 * 추가적인 핸들러가 필요하다면 양식에 맞게 추가해주시면 감사하겠습니다.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(CommonException.class)
	public ResponseEntity<CommonResponse<Object>> commonExceptionHandler(CommonException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(AuthException.class)
	public ResponseEntity<CommonResponse<Object>> authExceptionHandler(AuthException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(CardException.class)
	public ResponseEntity<CommonResponse<Object>> cardExceptionHandler(CardException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(HorseException.class)
	public ResponseEntity<CommonResponse<Object>> horseExceptionHandler(HorseException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(ProductException.class)
	public ResponseEntity<CommonResponse<Object>> productExceptionHandler(ProductException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(RaceException.class)
	public ResponseEntity<CommonResponse<Object>> raceExceptionHandler(RaceException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(TradingException.class)
	public ResponseEntity<CommonResponse<Object>> tradingExceptionHandler(TradingException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(UserException.class)
	public ResponseEntity<CommonResponse<Object>> userExceptionHandler(UserException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}

	@ExceptionHandler(ExternalApiException.class)
	public ResponseEntity<CommonResponse<Object>> externalApiExceptionHandler(ExternalApiException ex) {
		log.error("CommonException Occurred. Error Code: {}, Status: {}, Message: {}",
			ex.getErrorCode(), ex.getStatus(), ex.getMessage(), ex);
		return CommonResponse.error(ex.getStatus(), ex.getErrorCode());
	}
}
