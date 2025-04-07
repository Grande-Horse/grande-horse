package com.example.grandehorse.domain.race.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.card.controller.response.CardRaceRecordResponseDto;
import com.example.grandehorse.domain.card.entity.CardEntity;
import com.example.grandehorse.domain.race.entity.RaceRecordEntity;
import com.example.grandehorse.domain.race.repository.RaceRecordJpaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RaceRecordService {
	private final RaceRecordJpaRepository raceRecordJpaRepository;

	public CardRaceRecordResponseDto getCardRaceRecord(int userId, CardEntity cardEntity) {
		int totalRaces = cardEntity.getRaceCount();
		int totalPrize = cardEntity.getTotalPrize();

		List<RaceRecordEntity> raceRecords = raceRecordJpaRepository.findByUserIdAndCardId(userId, cardEntity.getId());
		int firstPlaces = 0;
		int secondPlaces = 0;
		int thirdPlaces = 0;

		for (RaceRecordEntity raceRecord : raceRecords) {
			switch (raceRecord.getRankNumber()) {
				case 1:
					firstPlaces++;
					break;
				case 2:
					secondPlaces++;
					break;
				case 3:
					thirdPlaces++;
					break;
				default:
					break;
			}
		}
		return CardRaceRecordResponseDto.builder()
			.cardId(cardEntity.getId())
			.totalFirstPlaces(firstPlaces)
			.totalSecondPlaces(secondPlaces)
			.totalThirdPlaces(thirdPlaces)
			.totalRaces(totalRaces)
			.totalPrize(totalPrize)
			.build();
	}
}
