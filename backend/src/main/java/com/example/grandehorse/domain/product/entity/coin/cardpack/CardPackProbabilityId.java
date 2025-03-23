package com.example.grandehorse.domain.product.entity.coin.cardpack;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import lombok.Getter;

@Getter
@Embeddable
public class CardPackProbabilityId implements Serializable {

	@Enumerated(EnumType.STRING)
	@Column(name = "card_rank")
	private CardRank cardRank;

	@Column(name = "cardpack_id")
	private byte cardPackId;

	public CardPackProbabilityId() {
	}

	public CardPackProbabilityId(CardRank cardRank, byte cardPackId) {
		this.cardRank = cardRank;
		this.cardPackId = cardPackId;
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (object == null || getClass() != object.getClass()) {
			return false;
		}
		CardPackProbabilityId that = (CardPackProbabilityId)object;
		return cardPackId == that.cardPackId && cardRank == that.cardRank;
	}

	@Override
	public int hashCode() {
		return Objects.hash(cardRank, cardPackId);
	}
}
