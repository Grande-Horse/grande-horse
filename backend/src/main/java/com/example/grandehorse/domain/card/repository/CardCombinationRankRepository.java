package com.example.grandehorse.domain.card.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.card.entity.CardCombinationRank;
import com.example.grandehorse.domain.horse.entity.HorseRank;

public interface CardCombinationRankRepository extends JpaRepository<CardCombinationRank, Byte> {
	Optional<CardCombinationRank> findByHorseRank(HorseRank horseRank);
}
