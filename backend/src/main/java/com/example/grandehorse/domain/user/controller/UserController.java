package com.example.grandehorse.domain.user.controller;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.grandehorse.domain.user.controller.request.SignUpDto;
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
	public ResponseEntity<CommonResponse<Void>> signUp(
		@RequestBody SignUpDto signUpDto,
		@CookieValue(value = "socialToken", required = false) String socialToken,
		HttpServletResponse response
	) {
		return userService.processSocialSignUp(signUpDto, socialToken, response);
	}
}
