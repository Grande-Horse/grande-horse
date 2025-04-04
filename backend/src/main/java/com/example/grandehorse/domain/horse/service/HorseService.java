package com.example.grandehorse.domain.horse.service;

import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.horse.entity.HorseDataEntity;
import com.example.grandehorse.domain.horse.entity.HorseEntity;
import com.example.grandehorse.domain.horse.entity.HorseRank;
import com.example.grandehorse.domain.horse.repository.HorseDataJpaRepository;
import com.example.grandehorse.domain.horse.repository.HorseJpaRepository;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.HorseException;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@AllArgsConstructor
public class HorseService {
	private final HorseJpaRepository horseJpaRepository;
	private final HorseDataJpaRepository horseDataJpaRepository;

	public int findHorseDataIdByHorseId(String horseId) {
		return horseDataJpaRepository.findTopByHorseIdOrderByCreatedAtDesc(horseId).getId();
	}

	public HorseDataEntity findHorseDataByHorseId(String horseId) {
		return horseDataJpaRepository.findTopByHorseIdOrderByCreatedAtDesc(horseId);
	}

	public HorseEntity getHorseById(String horseId) {
		return horseJpaRepository.findById(horseId)
			.orElseThrow(() -> new HorseException(CustomError.HORSE_NOT_FOUND));
	}

	public HorseRank getSingleHorseRankByIds(Set<String> horseIds) {
		List<HorseRank> ranks = horseJpaRepository.findDistinctHorseRanksByIds(horseIds);
		if (ranks.size() != 1) {
			throw new HorseException(CustomError.CARD_COMBINATION_RANK_NOT_MATCHED);
		}

		return ranks.get(0);
	}

	public HorseEntity pickRandomHorseByRank(HorseRank upgradedRank) {
		List<HorseEntity> candidates = horseJpaRepository.findAllByHorseRank(upgradedRank);
		if (candidates.isEmpty()) {
			throw new HorseException(CustomError.HORSE_NOT_AVAILABLE);
		}

		int random = new Random().nextInt(candidates.size());

		return candidates.get(random);
	}
}
