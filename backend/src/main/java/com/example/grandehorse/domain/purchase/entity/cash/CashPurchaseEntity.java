package com.example.grandehorse.domain.purchase.entity.cash;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cash_purchase", indexes = {
	@Index(name = "idx_user_id", columnList = "user_id")
})
public class CashPurchaseEntity {
	@Id
	@Column(name = "cash_order_id", nullable = false)
	private String cashOrderId;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "name", length = 60, nullable = false)
	private String name;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "acquired_coin", nullable = false)
	private int acquiredCoin;

	@Column(name = "purchased_at", nullable = false)
	private LocalDateTime purchasedAt;
}
