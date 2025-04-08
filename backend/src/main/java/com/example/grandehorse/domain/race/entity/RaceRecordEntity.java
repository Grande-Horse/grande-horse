package com.example.grandehorse.domain.race.entity;

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
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "race_record", indexes = {
	@Index(name = "idx_user_id", columnList = "user_id"),
	@Index(name = "idx_card_id", columnList = "card_id")
})
public class RaceRecordEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "card_id", nullable = false)
	private int cardId;

	@Column(name = "race_id", nullable = false)
	private int raceId;

	@Column(name = "rank_number", nullable = false)
	private byte rankNumber;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "fee", nullable = false)
	private int fee;

	@Column(name = "s1f_time", nullable = false)
	private double s1fTime;

	@Column(name = "g3f_time", nullable = false)
	private double g3fTime;

	@Column(name = "g1f_time", nullable = false)
	private double g1fTime;

	@Column(name = "raced_at", updatable = false, nullable = false)
	private LocalDateTime racedAt;
}
