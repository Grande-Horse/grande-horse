package com.example.grandehorse.domain.auth.controller;

import java.io.IOException;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.auth.controller.request.SocialAuthorizationDto;
import com.example.grandehorse.domain.auth.service.AuthService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	// 테스트용 API
	@GetMapping("/test/login/{social}")
	public ResponseEntity<CommonResponse<String>> ssafyConnect(
		@PathVariable String social,
		HttpServletResponse response
	) throws IOException {
		return CommonResponse.success(authService.getLoginUrl(social));
	}

	// 테스트용 API
	@GetMapping("/ssafy/callback")
	public ResponseEntity<CommonResponse<String>> ssafyCallback(@RequestParam("code") String code) {
		return CommonResponse.success(code);
	}

	// 테스트용 API
	@GetMapping("/kakao/callback")
	public ResponseEntity<CommonResponse<String>> kakaoCallback(@RequestParam("code") String code) {
		return CommonResponse.success(code);
	}

	@PostMapping("/login")
	public ResponseEntity<CommonResponse<Map>> oauthCallback(
		@RequestBody SocialAuthorizationDto socialAuthorizationDto,
		HttpServletResponse response
	) {
		return authService.processUserAuthentication(
			socialAuthorizationDto,
			response
		);
	}

	@GetMapping("/auto-login")
	public ResponseEntity<CommonResponse<Void>> autoLogin(HttpServletResponse response) throws IOException {
		return CommonResponse.success(null);
	}
}
