package com.example.grandehorse.domain.horse.entity;

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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "horse", indexes = {
	@Index(name = "idx_horse_rank", columnList = "horse_rank")
})
public class HorseEntity {
	@Id
	@Column(length = 7, nullable = false)
	private String id; // 마사회에서 제공하는 말 고유번호

	@Column(name = "name", length = 30, nullable = false)
	private String name; // 마사회에서 제공하는 말 이름

	@Enumerated(EnumType.STRING)
	@Column(name = "coat_color", length = 10, nullable = false)
	private CoatColor coatColor;

	@Enumerated(EnumType.STRING)
	@Column(name = "horse_rank", length = 6, nullable = false)
	private HorseRank horseRank;

	@Column(name = "weight", nullable = false)
	private short weight; // kg

	@Column(name = "speed", nullable = false)
	private double speed; // km/h

	@Column(name = "acceleration", nullable = false)
	private double acceleration; // km/s

	@Column(name = "stamina", nullable = false)
	private double stamina;

	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}
