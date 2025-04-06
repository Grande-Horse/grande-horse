package com.example.grandehorse.domain.race.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RaceRoom {
	private Long roomId;

	private String roomName;

	private int currentPlayers;

	private int maxPlayers;

	private String rankRestriction;

	private int bettingCoin;
}
