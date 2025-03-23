package com.example.grandehorse.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.UserException;

@Embeddable
public class Coin {
	@Column(name = "coin", nullable = false)
	private int value;

	public Coin(int value) {
		this.value = value;
	}

	public void decreaseCoin(int amount) {
		this.value = this.value - amount;
	}

	public void increaseCoin(int amount) {
		this.value = this.value + amount;
	}

	private void validateCoin(int amount) {
		if (this.value - amount < 0) {
			throw new UserException(CustomError.USER_NOT_ENOUGH_COIN);
		}
	}
}
