package com.example.grandehorse.domain.race.controller.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PlayerRaceProgress {
    private int userId;

    private double distance;
}
