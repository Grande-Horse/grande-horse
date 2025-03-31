package com.example.grandehorse.domain.user.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user", indexes = {
	@Index(name = "idx_social_provider_social_id", columnList = "social_provider, social_id")})
@Getter
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "email", length = 254, nullable = false)
	private String email;

	@Column(name = "nickname", length = 10, nullable = false, unique = true)
	private String nickname;

	@Enumerated(EnumType.STRING)
	@Column(name = "social_provider", length = 10, nullable = false)
	private SocialProvider socialProvider;

	@Column(name = "social_id", length = 50, nullable = false)
	private String socialId;

	@Embedded
	@Column(name = "coin", nullable = false)
	private Coin coin;

	@Column(name = "last_login_at")
	private LocalDateTime lastLoginAt;

	@Column(name = "registered_at", updatable = false, nullable = false)
	private LocalDateTime registeredAt;

	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;

	public static UserEntity signUp(String email, String nickname, SocialProvider socialProvider, String socialId) {
		return UserEntity.builder()
			.email(email)
			.nickname(nickname)
			.socialProvider(socialProvider)
			.socialId(socialId)
			.registeredAt(LocalDateTime.now())
			.coin(new Coin())
			.build();
	}

	public void increaseCoin(int price) {
		coin.increaseCoin(price);
	}

	public void validateCoin(int price) {
		coin.validateCoin(price);
	}

	public void decreaseCoin(int price) {
		coin.decreaseCoin(price);
	}
}
