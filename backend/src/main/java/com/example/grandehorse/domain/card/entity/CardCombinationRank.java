package com.example.grandehorse.domain.card.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.example.grandehorse.domain.horse.entity.HorseRank;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "card_combination_rank")
public class CardCombinationRank {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private byte id;

	@Enumerated(EnumType.STRING)
	@Column(name = "horse_rank", length = 6, nullable = false)
	private HorseRank horseRank;

	@Column(name = "probability", nullable = false)
	private double probability;
}
