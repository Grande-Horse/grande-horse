package com.example.grandehorse.domain.horse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.horse.entity.HorseDataEntity;

@Repository
public interface HorseDataJpaRepository extends JpaRepository<HorseDataEntity, Integer> {
	HorseDataEntity findTopByHorseIdOrderByCreatedAtDesc(String horseId);
}
