package com.example.grandehorse.domain.product.entity.coin.cardpack;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "cardpack")
public class CardPackEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private byte id;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "card_count", nullable = false)
	private byte cardCount;
}
