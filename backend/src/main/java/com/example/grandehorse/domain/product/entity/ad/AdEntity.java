package com.example.grandehorse.domain.product.entity.ad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ad")
public class AdEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private byte id;

	@Column(name = "url", length = 500, nullable = false)
	private String url;

	@Column(name = "runtime", nullable = false)
	private int runtime;
}
