package com.example.grandehorse.domain.purchase.entity.step;

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
@Table(name = "step", indexes = {
	@Index(name = "idx_user_exchanged", columnList = "user_id, exchanged_at")
})
public class StepEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(name = "user_id", nullable = false)
	private int userId;

	@Column(name = "count", nullable = false)
	private int count;

	@Column(name = "acquired_at", nullable = false)
	private LocalDateTime acquiredAt;

	@Column(name = "exchanged_at")
	private LocalDateTime exchangedAt;
}
