package com.example.grandehorse.domain.race.controller.response;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
	private String sender;

	private String message;

	private LocalTime time;
}
