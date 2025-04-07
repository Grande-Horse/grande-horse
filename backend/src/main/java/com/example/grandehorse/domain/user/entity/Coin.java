package com.example.grandehorse.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.UserException;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class Coin {
	@Column(name = "coin", nullable = false)
	private int value;

	public Coin(int value) {
		this.value = value;
	}

	public void decreaseCoin(int price) {
		this.value = this.value - price;
	}

	public void increaseCoin(int price) {
		this.value = this.value + price;
	}

	public void validateCoin(int price) {
		if (this.value - price < 0) {
			throw new UserException(CustomError.USER_NOT_ENOUGH_COIN);
		}
	}
}
