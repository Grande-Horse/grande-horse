package com.example.grandehorse.domain.horse.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.horse.entity.HorseEntity;
import com.example.grandehorse.domain.horse.entity.HorseRank;

@Repository
public interface HorseJpaRepository extends JpaRepository<HorseEntity, String> {
	Optional<HorseEntity> findHorseById(String id);

	List<HorseEntity> findAllByHorseRank(HorseRank upgradedRank);

	@Query("""
			select distinct h.horseRank
			from HorseEntity h
			where h.id in :horseIds
		""")
	List<HorseRank> findDistinctHorseRanksByIds(@Param("horseIds") Set<String> horseIds);

}
