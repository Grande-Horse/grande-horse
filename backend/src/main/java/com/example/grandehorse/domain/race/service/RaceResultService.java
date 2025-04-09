package com.example.grandehorse.domain.race.service;

import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.race.controller.response.GameResult;
import com.example.grandehorse.domain.race.controller.response.PlayerRaceProgress;
import com.example.grandehorse.domain.race.entity.RaceEntity;
import com.example.grandehorse.domain.race.entity.RaceRecordEntity;
import com.example.grandehorse.domain.race.repository.RaceJpaRepository;
import com.example.grandehorse.domain.race.repository.RaceRecordJpaRepository;
import com.example.grandehorse.domain.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RaceResultService {

    private final UserService userService;
    private final CardService cardService;
    private final RaceJpaRepository raceJpaRepository;
    private final RaceRecordJpaRepository raceRecordJpaRepository;

    @Transactional
    public List<GameResult> processRaceResult(
            int bettingCoin,
            int playerCount,
            String roomKey,
            List<PlayerRaceProgress> allPlayers,
            RedisTemplate<String, Object> websocketRedisTemplate
    ) {
        int totalPrize = bettingCoin * (playerCount-1);
        int ownerId = Integer.parseInt(
                websocketRedisTemplate.opsForValue().get(roomKey + ":owner").toString()
        );
        int raceId = saveRace(ownerId, totalPrize, (byte) playerCount);

        allPlayers.sort((p1, p2) -> Double.compare(p2.getDistance(), p1.getDistance()));
        int winnerId = allPlayers.get(0).getUserId();

        List<GameResult> gameResults = new ArrayList<>();

        for (int i = 0; i < allPlayers.size(); i++) {
            int rankNumber = i + 1;
            int userId = allPlayers.get(i).getUserId();
            String userKey = roomKey + ":user:" + userId;

            int cardId = Integer.parseInt(
                    websocketRedisTemplate.opsForHash().get(userKey, "cardId").toString()
            );
            String nickname = websocketRedisTemplate.opsForHash().get(userKey, "userNickname").toString();

            if (userId == winnerId) {
                userService.increaseUserCoin(userId, totalPrize);
                cardService.updateCardWinRecord(cardId, totalPrize);
                saveRaceRecord(userId, cardId, raceId, (byte) rankNumber, totalPrize, bettingCoin);
                gameResults.add(new GameResult(nickname, totalPrize, rankNumber));
            } else {
                userService.decreaseUserCoin(userId, bettingCoin);
                cardService.updateCardRaceRecord(cardId);
                saveRaceRecord(userId, cardId, raceId, (byte) rankNumber, 0, bettingCoin);
                gameResults.add(new GameResult(nickname, -bettingCoin, rankNumber));
            }
        }

        return gameResults;
    }

    private int saveRace(int ownerId, int totalPrize, byte playerCount) {
        RaceEntity raceEntity = RaceEntity.builder()
                .userId(ownerId)
                .totalPrize(totalPrize)
                .playerCount(playerCount)
                .racedAt(LocalDateTime.now())
                .build();
        return raceJpaRepository.save(raceEntity).getId();
    }

    private void saveRaceRecord(int userId, int cardId, int raceId,
                                byte rankNumber, int totalPrize, int fee) {
        RaceRecordEntity raceRecordEntity = RaceRecordEntity.builder()
                .userId(userId)
                .cardId(cardId)
                .raceId(raceId)
                .rankNumber(rankNumber)
                .price(totalPrize)
                .fee(fee)
                .racedAt(LocalDateTime.now())
                .build();
        raceRecordJpaRepository.save(raceRecordEntity);
    }
}
