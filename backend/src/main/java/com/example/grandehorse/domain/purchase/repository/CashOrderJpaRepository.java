package com.example.grandehorse.domain.purchase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.purchase.entity.cash.CashOrderEntity;

public interface CashOrderJpaRepository extends JpaRepository<CashOrderEntity, String> {
}
