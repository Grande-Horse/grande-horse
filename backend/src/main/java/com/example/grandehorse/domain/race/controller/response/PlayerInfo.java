package com.example.grandehorse.domain.race.controller.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerInfo {
	private int userId;

	private String userNickname;

	private String horseName;

	private String horseColor;

	private String horseRank;

	private boolean isRoomOwner;

	private boolean isReady;
}
