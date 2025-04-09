package com.example.grandehorse.domain.purchase.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.PurchaseException;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class MerchantUidInfo {
	private final Byte productId;
	private final int price;
	private final int userId;
	private final LocalDateTime timestamp;
	private final String uuid;

	private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

	public MerchantUidInfo(Byte productId, int price, int userId) {
		this.productId = productId;
		this.price = price;
		this.userId = userId;
		this.timestamp = LocalDateTime.now();
		this.uuid = UUID.randomUUID().toString().substring(0, 8);
	}

	public static MerchantUidInfo fromRawUid(String rawUid) {
		try {
			String[] parts = rawUid.split("_");

			if (parts.length != 6 || !parts[0].equals("order")) {
				throw new PurchaseException(CustomError.INVALID_PAYMENT);
			}

			return MerchantUidInfo.builder()
				.productId(Byte.parseByte(parts[1]))
				.price(Integer.parseInt(parts[2]))
				.userId(Integer.parseInt(parts[3]))
				.timestamp(LocalDateTime.parse(parts[4], DateTimeFormatter.ofPattern("yyyyMMddHHmmss")))
				.uuid(parts[5])
				.build();
		} catch (Exception e) {
			throw new PurchaseException(CustomError.INVALID_PAYMENT);
		}
	}

	@Override
	public String toString() {
		return String.format("order_%s_%s_%s_%s_%s", productId, price, userId, timestamp.format(FORMATTER), uuid);
	}
}
