package com.example.grandehorse.domain.card.entity;

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
@Table(name = "card_record", indexes = {
	@Index(name = "idx_card_id", columnList = "card_id")})
public class CardRecordEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "card_id", nullable = false)
	private int cardId;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Enumerated(EnumType.STRING)
	@Column(name = "acquired_way", length = 11, nullable = false)
	private AcquiredWay acquiredWay;

	@Column(name = "acquired_id", nullable = false)
	private int acquiredId;

	@Column(name = "acquired_at", nullable = false)
	private LocalDateTime acquiredAt;
}
