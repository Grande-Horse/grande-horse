package com.example.grandehorse.domain.purchase.entity.coin;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coin_purchase", indexes = {
	@Index(name = "idx_user_id", columnList = "user_id")
})
@Getter
public class CoinPurchaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "product_id", nullable = false)
	private byte productId;

	@Column(name = "name", length = 60, nullable = false)
	private String name;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "purchased_at", nullable = false)
	private LocalDateTime purchasedAt;
}
