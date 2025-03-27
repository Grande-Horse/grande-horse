package com.example.grandehorse.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

/**
 * 커스텀 에러 코드를 정의하는 곳입니다.
 * 정의하고자 하는 커스텀 에러의 종류에 맞추어 주석 아래에 에러코드를 순차적으로 작성해주시면 됩니다. (A1, A2, A3 ...)
 * 팀원간의 커밋 충돌이 나지 않도록 주의합시다!
 */
@Getter
public enum CustomError {
	// 공통 에러
	INPUT_LENGTH_EXCEEDED(HttpStatus.BAD_REQUEST, "C1", "입력할 수 있는 글자 길이를 초과하였습니다."),

	// 인증 관련 에러
	INVALID_TOKEN(HttpStatus.BAD_REQUEST, "A1", "유효하지 않은 토큰이거나 토큰이 존재하지 않습니다."),
	BLACKLISTED_TOKEN(HttpStatus.BAD_REQUEST, "A2", "블랙리스트에 등록된 토큰입니다."),
	ID_TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "A3", "ID 토큰이 유효기간이 만료 되었습니다."),

	// 유저 관련 에러
	USER_DUPLICATE_NICKNAME(HttpStatus.BAD_REQUEST, "U1", "중복되는 유저 닉네임입니다."),
	USER_NOT_ENOUGH_COIN(HttpStatus.BAD_REQUEST, "U2", "유저의 코인이 부족합니다."),
	USER_NOT_EXISTED(HttpStatus.BAD_REQUEST, "U3", "존재하지 않는 유저입니다."),

	// 말 관련 에러

	// 거래 관련 에러
	CARD_NOT_FOR_SALE(HttpStatus.BAD_REQUEST, "T1", "판매중인 말이 아닙니다."),
	CANNOT_PURCHASE_OWN_CARD(HttpStatus.BAD_REQUEST, "T2", "자신의 카드를 구매할 수 없습니다."),
	CANNOT_CANCEL_TRADE_PERMISSION(HttpStatus.BAD_REQUEST, "T3", "거래(판매) 취소에 대한 권한이 없습니다."),

	// 상품 관련 에러

	// 카드 관련 에러
	USER_NOT_OWNER_OF_CARD(HttpStatus.BAD_REQUEST, "CA1", "유저의 말카드가 아닙니다."),
	CARD_SALE_RESTRICTED(HttpStatus.BAD_REQUEST, "CA2", "판매할 수 없는 말카드 입니다."),
	CARD_NOT_EXISTED(HttpStatus.BAD_REQUEST, "CA3", "존재하지 않는 말카드입니다."),

	// 경마 관련 에러

	// 외부 API 관련 에러
	EXTERNAL_SERVICE_PARSE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "E1", "외부 API 응답 처리 중 오류가 발생했습니다.");

	private final HttpStatus httpStatus;
	private final String errorCode;
	private final String errorMessage;

	CustomError(HttpStatus httpStatus, String errorCode, String errorMessage) {
		this.httpStatus = httpStatus;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}
}
