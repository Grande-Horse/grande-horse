package com.example.grandehorse.domain.product.entity.coin.cardpack;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cardpack_probability", indexes = {
	@Index(name = "idx_cardpack_id", columnList = "cardpack_id")
})
@Getter
public class CardPackProbabilityEntity {
	@EmbeddedId
	private CardPackProbabilityId id; // 복합키 card_rank & card_pack_id

	@Column(name = "probability", nullable = false)
	private double probability;
}
