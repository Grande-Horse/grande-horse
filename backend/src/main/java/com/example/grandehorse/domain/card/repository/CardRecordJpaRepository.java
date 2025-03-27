package com.example.grandehorse.domain.card.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.card.entity.CardRecordEntity;

public interface CardRecordJpaRepository extends JpaRepository<CardRecordEntity, Integer> {
}
