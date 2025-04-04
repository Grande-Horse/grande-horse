package com.example.grandehorse.domain.purchase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.grandehorse.domain.purchase.entity.cash.CashPurchaseEntity;

public interface CashPurchaseJpaRepository extends JpaRepository<CashPurchaseEntity, String> {
}
