package com.example.grandehorse.domain.horse.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "horse_data", indexes = {
	@Index(name = "idx_horse_id_created_at", columnList = "horse_id, created_at DESC")
})
public class HorseDataEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "horse_id", length = 7, nullable = false)
	private String horseId; // 마사회에서 제공되는 말 고유번호

	@Column(name = "latest_rank", length = 20, nullable = false)
	private String latestRank;

	@Column(name = "weight", nullable = false)
	private short weight;

	@Column(name = "avg_s1f_time", nullable = false)
	private double avgS1fTime;

	@Column(name = "avg_g3f_time", nullable = false)
	private double avgG3fTime;

	@Column(name = "avg_g1f_time", nullable = false)
	private double avgG1fTime;

	@Column(name = "speed", nullable = false)
	private double speed;

	@Column(name = "acceleration", nullable = false)
	private double acceleration;

	@Column(name = "stamina", nullable = false)
	private double stamina;

	@Column(name = "race_count", nullable = false)
	private byte raceCount;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
}