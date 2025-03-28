package com.example.grandehorse.domain.auth.controller;

import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@GetMapping(value = "/login-ssafy")
	public void ssafyConnect(HttpServletResponse response) throws IOException {
		response.sendRedirect(authService.getSsafyLoginUrl());
	}

	@GetMapping("/ssafy/callback")
	public void ssafyCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
		response.sendRedirect(authService.processSsafyUserAuthentication(code, response));
	}

	@GetMapping(value = "/login-kakao")
	public void kakaoConnect(HttpServletResponse response) throws IOException {
		response.sendRedirect(authService.getKakaoLoginUrl());
	}

	@GetMapping("/kakao/callback")
	public void kakaoCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
		response.sendRedirect(authService.processKakaoUserAuthentication(code, response));
	}
}
