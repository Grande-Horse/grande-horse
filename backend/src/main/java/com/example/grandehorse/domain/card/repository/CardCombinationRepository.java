package com.example.grandehorse.domain.card.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.card.entity.CardCombinationEntity;

public interface CardCombinationRepository extends JpaRepository<CardCombinationEntity, Integer> {
}
