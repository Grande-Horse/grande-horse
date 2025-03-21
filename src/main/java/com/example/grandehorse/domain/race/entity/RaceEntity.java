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
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "race", indexes = {
	@Index(name = "idx_user_id", columnList = "user_id")
})
public class RaceEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "total_prize", nullable = false)
	private int totalPrize;

	@Column(name = "player_count", nullable = false)
	private byte playerCount;

	@Column(name = "raced_at", updatable = false, nullable = false)
	private LocalDateTime racedAt;
}
