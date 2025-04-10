package com.example.grandehorse.domain.race.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.race.entity.RaceEntity;

public interface RaceJpaRepository extends JpaRepository<RaceEntity, Integer> {
}
