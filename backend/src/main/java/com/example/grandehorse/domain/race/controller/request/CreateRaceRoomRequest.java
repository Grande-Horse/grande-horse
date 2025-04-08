package com.example.grandehorse.domain.race.controller.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRaceRoomRequest {
	private String roomName;

	private int maxPlayers;

	private String rankRestriction;

	private int bettingCoin;
}
