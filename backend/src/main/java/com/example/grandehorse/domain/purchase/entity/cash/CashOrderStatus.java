package com.example.grandehorse.domain.purchase.entity.cash;

import lombok.Getter;

/**
 * PENDING : 진행중
 * SUCCESS : 성공
 * FAIL : 실패
 * CANCEL : 취소
 * REFUND : 환불
 */
@Getter
public enum CashOrderStatus {
	PENDING,
	SUCCESS,
	FAIL,
	CANCEL,
	REFUND;
}
