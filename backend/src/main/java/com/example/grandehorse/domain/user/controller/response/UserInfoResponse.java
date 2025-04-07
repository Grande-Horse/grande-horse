package com.example.grandehorse.domain.user.controller.response;

import com.example.grandehorse.domain.card.controller.response.CardResponseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserInfoResponse {
    private int id;

    private String nickname;

    private int coin;

    private CardResponseDto representativeCard;
}
