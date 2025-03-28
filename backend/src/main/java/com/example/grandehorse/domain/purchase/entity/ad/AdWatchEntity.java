package com.example.grandehorse.domain.purchase.entity.ad;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ad_watch", indexes = {
	@Index(name = "idx_user_ad", columnList = "user_id, ad_id")
})
public class AdWatchEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "ad_id", nullable = false)
	private byte adId;

	@Column(name = "time", nullable = false)
	private int time;

	@Column(name = "watched_at", nullable = false)
	private LocalDateTime watchedAt;
}
