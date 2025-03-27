package com.example.grandehorse.domain.product.entity.cash;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cash_product")
public class CashProductEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private byte id;

	@Column(name = "name", length = 60, nullable = false)
	private String name;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "acquired_coin", nullable = false)
	private int acquiredCoin;

	@Column(name = "selling", nullable = false)
	private boolean selling;
}
