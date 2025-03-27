package com.example.grandehorse.domain.horse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.horse.entity.HorseEntity;

@Repository
public interface HorseJpaRepository extends JpaRepository<HorseEntity, Integer> {
}
