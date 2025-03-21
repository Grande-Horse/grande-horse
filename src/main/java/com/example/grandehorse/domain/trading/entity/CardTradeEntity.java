package com.example.grandehorse.domain.trading.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "card_trade")
public class CardTradeEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "horse_id", length = 7, nullable = false)
	private String horseId; // 마사회에서 제공하는 말 고유번호

	@Column(name = "card_id", nullable = false)
	private int cardId;

	@Column(name = "seller_id", nullable = false)
	private int sellerId;

	@Column(name = "buyer_id")
	private int buyerId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", length = 8, nullable = false)
	private CardTradeStatus status;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "registered_at", updatable = false, nullable = false)
	private LocalDateTime registeredAt;

	@Column(name = "sold_at")
	private LocalDateTime soldAt;

	@Column(name = "canceled_at")
	private LocalDateTime canceledAt;

	@Column(name = "horse_data_id")
	private int horseDataId;
}
