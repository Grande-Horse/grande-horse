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
	HORSE_NOT_EXISTED(HttpStatus.BAD_REQUEST, "H1", "존재하지 않는 말입니다."),
	HORSE_NOT_AVAILABLE(HttpStatus.BAD_REQUEST, "H2", "해당 등급의 말이 존재하지 않습니다"),

	// 거래 관련 에러
	CARD_NOT_FOR_SALE(HttpStatus.BAD_REQUEST, "T1", "판매중인 말 카드가 아닙니다."),
	CANNOT_PURCHASE_OWN_CARD(HttpStatus.BAD_REQUEST, "T2", "자신의 카드를 구매할 수 없습니다."),
	CANNOT_CANCEL_TRADE_PERMISSION(HttpStatus.BAD_REQUEST, "T3", "거래(판매) 취소에 대한 권한이 없습니다."),

	// 상품 관련 에러
	PRODUCT_NOT_FOUND(HttpStatus.BAD_REQUEST, "P1", "존재하지 않는 상품입니다."),
	PRODUCT_NOT_SELLING(HttpStatus.BAD_REQUEST, "P2", "현재 판매 중인 상품이 아닙니다."),
	CARD_PACK_PROBABILITY_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "P3", "카드팩에 대한 등급 확률이 정의되지 않았습니다."),
	INVALID_CARD_PACK_PROBABILITY(HttpStatus.INTERNAL_SERVER_ERROR, "P4", "카드팩에 대한 확률이 잘못정의되어 있습니다."),

	// 구매 관련 에러
	EXPIRED_PURCHASE_REQUEST(HttpStatus.BAD_REQUEST, "PC1", "구매 요청이 만료되었습니다."),
	PAYMENT_VERIFIED_BUT_REQUEST_MISSING(HttpStatus.BAD_REQUEST, "PC2", "결제는 완료되었지만 구매 요청 정보가 없습니다."),
	INVALID_PAYMENT(HttpStatus.BAD_REQUEST, "PC3", "유효하지 않은 결제입니다."),
	DUPLICATE_PURCHASE(HttpStatus.BAD_REQUEST, "PC4", "이미 처리된 구매 요청입니다."),
	INVALID_PAYMENT_AMOUNT(HttpStatus.BAD_REQUEST, "PC5", "결제 금액이 일치하지 않습니다."),
	ALREADY_PURCHASED_TODAY(HttpStatus.BAD_REQUEST, "PC6", "오늘은 이미 카드팩을 구매하셨습니다."),
	INSUFFICIENT_BALANCE(HttpStatus.BAD_REQUEST, "PC7", "보유 코인이 부족하여 구매할 수 없습니다."),

	// 카드 관련 에러
	USER_NOT_OWNER_OF_CARD(HttpStatus.BAD_REQUEST, "CA1", "유저의 말카드가 아닙니다."),
	CARD_SALE_RESTRICTED(HttpStatus.BAD_REQUEST, "CA2", "판매할 수 없는 말카드 입니다."),
	CARD_NOT_EXISTED(HttpStatus.BAD_REQUEST, "CA3", "존재하지 않는 말카드입니다."),
	CARD_NOT_ELIGIBLE_FOR_REPRESENTATION(HttpStatus.BAD_REQUEST, "CA4", "출전마가 될 수 없는 카드입니다."),
	CARD_NOT_ELIGIBLE_FOR_CANDIDATE(HttpStatus.BAD_REQUEST, "CA5", "경주마로 등록 또는 해제할 수 없는 카드입니다."),
	CARD_CANDIDATE_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "CA6", "출전마 및 대표마는 최대 6마리까지만 등록할 수 있습니다"),
	INVALID_COMBINATION_COUNT(HttpStatus.BAD_REQUEST, "CA7", "합성을 위해 3장의 카드가 필요합니다."),
	CARD_NOT_OWNED_OR_INVALID_STATUS(HttpStatus.BAD_REQUEST, "CA8", "합성에 사용하지 못하는 카드가 포함되어있습니다."),
	CARD_COMBINATION_RANK_NOT_MATCHED(HttpStatus.BAD_REQUEST, "CA9", "카드 등급이 모두 같아야 합니다."),
	CARD_COMBINATION_RANK_NOT_FOUND(HttpStatus.BAD_REQUEST, "CA10", "강화할 수 없는 카드 등급입니다."),
	INVALID_RANK_VALUE(HttpStatus.BAD_REQUEST, "CA11", "조회할 수 없는 등급입니다."),
	NO_REPRESENTATIVE_HORSE_CARD(HttpStatus.BAD_REQUEST, "CA12", "대표로 등록된 맒카드가 없습니다."),

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
	USER_HAS_NOT_REPRESENTATIVE_HORSE_CARD(HttpStatus.BAD_REQUEST, "R10", "대표말 카드가 설정되어 있지 않습니다"),

	// 외부 API 관련 에러
	EXTERNAL_SERVICE_PARSE_ERROR(HttpStatus.BAD_REQUEST, "E1", "외부 API 응답 처리 중 오류가 발생했습니다."),
	PORTONE_PAYMENT_LOOKUP_FAILED(HttpStatus.BAD_REQUEST, "E2", "결제 정보 조회 중 오류가 발생했습니다."),
	PORTONE_PAYMENT_CANCEL_FAILED(HttpStatus.BAD_REQUEST, "E3", "결제 취소에 실패하였습니다.");

	private final HttpStatus httpStatus;
	private final String errorCode;
	private final String errorMessage;

	CustomError(HttpStatus httpStatus, String errorCode, String errorMessage) {
		this.httpStatus = httpStatus;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}
}
