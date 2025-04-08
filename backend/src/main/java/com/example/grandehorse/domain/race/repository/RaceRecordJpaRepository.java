package com.example.grandehorse.domain.race.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.race.entity.RaceRecordEntity;

@Repository
public interface RaceRecordJpaRepository extends JpaRepository<RaceRecordEntity, Integer> {
	List<RaceRecordEntity> findByUserIdAndCardId(int userId, int cardId);
}
