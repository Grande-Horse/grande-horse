package com.example.grandehorse.domain.user.controller;

import com.example.grandehorse.domain.user.controller.response.SignInfoResponse;
import com.example.grandehorse.domain.user.controller.response.UserInfoResponse;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.grandehorse.domain.user.controller.request.SignUpDto;
import com.example.grandehorse.domain.user.controller.response.CoinResponse;
import com.example.grandehorse.domain.user.service.UserService;
import com.example.grandehorse.global.response.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@GetMapping("/{nickname}/duplicate")
	public ResponseEntity<CommonResponse<Void>> duplicateNickname(
		@PathVariable("nickname") String nickname
	) {
		return userService.isNicknameAvailable(nickname);
	}

	@PostMapping("")
	public ResponseEntity<CommonResponse<SignInfoResponse>> signUp(
		@RequestBody SignUpDto signUpDto,
		@CookieValue(value = "socialToken", required = false) String socialToken,
		HttpServletResponse response
	) {
		return userService.processSocialSignUp(signUpDto, socialToken, response);
	}

	@GetMapping("/coin")
	public ResponseEntity<CommonResponse<CoinResponse>> coins(
		@RequestAttribute("userId") int userId
	) {
		return userService.getUserCoin(userId);
	}

	@GetMapping("/info")
	public ResponseEntity<CommonResponse<UserInfoResponse>> getUserInfo(
		@RequestAttribute("userId") int userId
	) {
		return userService.getUserInfo(userId);
	}
}
