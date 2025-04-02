package com.example.grandehorse.domain.race.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerInfo {
	private Integer userId;

	private Integer cardId;

	private String horseId;

	private String userNickname;

	private String horseName;

	private String horseColor;

	private String horseRank;

	private Short weight;

	private Double speed;

	private Double acceleration;

	private Double stamina;

	private String getUserNickname;

	private boolean isRoomOwner;
}
