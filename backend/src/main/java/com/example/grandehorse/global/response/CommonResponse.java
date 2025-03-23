package com.example.grandehorse.global.response;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommonResponse<T> {
	private final String errorCode;
	private final Object data;

	/**
	 * 일반적인 데이터 성공 응답
	 * @param data 응답할 데이터
	 * @param <T> 데이터 타입
	 * @return 성공적인 데이터 응답을 포함한 ResponseEntity
	 */
	public static <T> ResponseEntity<CommonResponse<T>> success(
		T data
	) {
		return ResponseEntity
			.status(HttpStatus.OK)
			.body(new CommonResponse<>(null, data));
	}

	/**
	 * 리스트 성공 응답
	 * @param items 응답할 리스트 데이터
	 * @param <T> 데이터 타입
	 * @return 성공적인 리스트 응답을 포함한 ResponseEntity
	 */
	public static <T> ResponseEntity<CommonResponse<List<T>>> listSuccess(
		List<T> items
	) {
		return ResponseEntity
			.status(HttpStatus.OK)
			.body(new CommonResponse<>(null, new DataWrapper<>(items, false, null)));
	}

	/**
	 * 페이징 처리된 성공 응답
	 * @param items 응답할 리스트 데이터
	 * @param hasNextItems 다음 페이지가 있는지 여부
	 * @param nextCursorId 다음 페이지로 이동할 커서 ID
	 * @param <T> 데이터 타입
	 * @return 페이징 처리된 성공 응답을 포함한 ResponseEntity
	 */
	public static <T> ResponseEntity<CommonResponse<List<T>>> pagedSuccess(
		List<T> items,
		boolean hasNextItems,
		Long nextCursorId
	) {
		return ResponseEntity
			.status(HttpStatus.OK)
			.body(new CommonResponse<>(null, new DataWrapper<>(items, hasNextItems, nextCursorId)));
	}

	/**
	 * 에러 응답
	 * @param status HTTP 상태 코드
	 * @param errorCode 에러 코드
	 * @param <T> 데이터 타입 (에러 응답에서는 null)
	 * @return 에러 응답을 포함한 ResponseEntity
	 */
	public static <T> ResponseEntity<CommonResponse<T>> error(
		HttpStatus status,
		String errorCode
	) {
		return ResponseEntity
			.status(status)
			.body(new CommonResponse<>(errorCode, null));
	}

	@Getter
	@AllArgsConstructor
	public static class DataWrapper<T> {
		private final T items;
		private final Boolean hasNextItems;
		private final Long nextCursorId;
	}
}
