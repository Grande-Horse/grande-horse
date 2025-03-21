package com.example.grandehorse.domain.purchase.entity.cash;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "cash_order", indexes = {
	@Index(name = "idx_user_id", columnList = "user_id")
})
public class CashOrderEntity {
	@Id
	private int id; // 해당 칼럼에는 PG사의 주문번호를 저장해야 합니다.

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "product_id", nullable = false)
	private int productId;

	@Column(name = "name", length = 60, nullable = false)
	private String name;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "acquired_coin", nullable = false)
	private int acquiredCoin;

	@Column(name = "pay_method", length = 12, nullable = false)
	private String payMethod;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", length = 7, nullable = false)
	private CashOrderStatus status;

	@Column(name = "ordered_at", nullable = false)
	private LocalDateTime orderedAt;
}
