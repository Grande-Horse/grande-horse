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
	FORBIDDEN_WORD(HttpStatus.BAD_REQUEST, "C2", "사용할 수 없는 단어가 포함되어 있습니다."),

	// 인증 관련 에러
	INVALID_TOKEN(HttpStatus.BAD_REQUEST, "A1", "유효하지 않은 토큰이거나 토큰이 존재하지 않습니다."),
	BLACKLISTED_TOKEN(HttpStatus.BAD_REQUEST, "A2", "블랙리스트에 등록된 토큰입니다."),

	// 유저 관련 에러
	USER_DUPLICATE_NICKNAME(HttpStatus.BAD_REQUEST, "U1", "중복되는 유저 닉네임입니다."),
	USER_NOT_ENOUGH_COIN(HttpStatus.BAD_REQUEST, "U2", "유저의 코인이 부족합니다."),
	USER_NOT_EXISTED(HttpStatus.BAD_REQUEST, "U3", "존재하지 않는 유저입니다."),

	// 말 관련 에러
	HORSE_NOT_EXISTED(HttpStatus.BAD_REQUEST, "H1", "존재하지 않는 말입니다."),

	// 거래 관련 에러
	CARD_NOT_FOR_SALE(HttpStatus.BAD_REQUEST, "T1", "판매중인 말 카드가 아닙니다."),
	CANNOT_PURCHASE_OWN_CARD(HttpStatus.BAD_REQUEST, "T2", "자신의 카드를 구매할 수 없습니다."),
	CANNOT_CANCEL_TRADE_PERMISSION(HttpStatus.BAD_REQUEST, "T3", "거래(판매) 취소에 대한 권한이 없습니다."),

	// 상품 관련 에러

	// 카드 관련 에러
	USER_NOT_OWNER_OF_CARD(HttpStatus.BAD_REQUEST, "CA1", "유저의 말카드가 아닙니다."),
	CARD_SALE_RESTRICTED(HttpStatus.BAD_REQUEST, "CA2", "판매할 수 없는 말카드 입니다."),
	CARD_NOT_EXISTED(HttpStatus.BAD_REQUEST, "CA3", "존재하지 않는 말카드입니다."),
	NO_REPRESENTATIVE_HORSE_CARD(HttpStatus.BAD_REQUEST, "CA4", "대표로 등록된 말카드가 없습니다."),

	// 경마 관련 에러
	RACE_ROOM_NOT_EXISTED(HttpStatus.BAD_REQUEST, "R1", "존재하지 않는 방입니다."),
	RACE_ROOM_IS_ALREADY_EXISTED(HttpStatus.BAD_REQUEST, "R2", "중복된 방입니다."),
	RACE_ROOM_MAX_PLAYER(HttpStatus.BAD_REQUEST, "R3", "최대 참여 가능 인원을 초과하였습니다."),
	ONLY_OWNER_CAN_START_RACE(HttpStatus.BAD_REQUEST, "R4", "방장만이 게임을 시작할 수 있습니다."),
	NOT_ALL_PLAYERS_READY(HttpStatus.BAD_REQUEST, "R5", "모든 유저가 준비하지 않았습니다."),
	RACE_ALREADY_START(HttpStatus.BAD_REQUEST, "R6", "이미 경주가 시작된 방입니다"),
	USER_NOT_OWNER_OF_RACE_ROOM(HttpStatus.BAD_REQUEST, "R7", "방장이 아닙니다."),
	ALREADY_EXIST_USER(HttpStatus.BAD_REQUEST, "R8", "이미 경주 방에 존재하는 유저 입니다."),
	USER_HAS_NOT_ENOUGH_COIN(HttpStatus.BAD_REQUEST, "R9", "코인이 부족해 방에 참여할 수 없습니다"),

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
