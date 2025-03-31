package com.example.grandehorse.domain.horse.service;

import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.horse.entity.HorseDataEntity;
import com.example.grandehorse.domain.horse.entity.HorseEntity;
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

	public HorseEntity findHorseById(String id) {
		return horseJpaRepository.findHorseById(id)
			.orElseThrow(() -> new HorseException(CustomError.HORSE_NOT_EXISTED));
	}
}
