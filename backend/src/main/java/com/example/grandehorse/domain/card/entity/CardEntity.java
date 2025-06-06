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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "card", indexes = {
	@Index(name = "idx_id_status", columnList = "id, status"),
	@Index(name = "idx_user_id_id", columnList = "user_id, id"),
	@Index(name = "idx_combination_id", columnList = "combination_id")
})
public class CardEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "horse_id", length = 7, nullable = false)
	private String horseId;

	/**
	 * 0 : 대기마
	 * 1 : 판매마
	 * 2 : 경주마
	 * 3 : 출전마
	 */
	@Column(name = "status", nullable = false)
	private byte status;

	@Enumerated(EnumType.STRING)
	@Column(name = "acquired_way", length = 11, nullable = false)
	private AcquiredWay acquiredWay;

	@Column(name = "acquired_at", nullable = false)
	private LocalDateTime acquiredAt;

	@Column(name = "race_count", nullable = false)
	private short raceCount;

	@Column(name = "victory_count", nullable = false)
	private short victoryCount;

	@Column(name = "total_prize", nullable = false)
	private int totalPrize;

	@Column(name = "combination_id")
	private int combinationId;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	public void updateStatusToReady() {
		status = 0;
	}

	public void updateStatusToSell() {
		status = 1;
	}

	public void updateStatusToRace() {
		status = 2;
	}

	public void updateStatusToRepresentative() {
		status = 3;
	}

	public void updateOwner(int userId) {
		this.userId = userId;
		status = 0;
		acquiredWay = AcquiredWay.TRADE;
		acquiredAt = LocalDateTime.now();
		raceCount = 0;
		victoryCount = 0;
		totalPrize = 0;
	}

	public void markAsCombined(int combinationId) {
		this.deletedAt = LocalDateTime.now();
		this.combinationId = combinationId;
	}

	public void updateWinRecord(int totalPrize) {
		this.raceCount += 1;
		this.victoryCount += 1;
		this.totalPrize += totalPrize;
	}

	public void updateRaceRecord() {
		this.raceCount += 1;
	}
}
