package com.example.grandehorse.domain.user.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
@Table(name = "coin_transaction", indexes = {
	@Index(name = "idx_user_id", columnList = "user_id"),
	@Index(name = "idx_coin_transaction_type_typeid", columnList = "type, type_id")
})
public class CoinTransaction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "after_coin", nullable = false)
	private int afterCoin;

	@Column(name = "transaction_at", nullable = false)
	private LocalDateTime transactionAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "io_status", length = 3, nullable = false)
	private IoStatus ioStatus;

	@Enumerated(EnumType.STRING)
	@Column(name = "type", length = 6, nullable = false)
	private TransactionType type;

	@Column(name = "type_id", nullable = false)
	private int typeId;
}
