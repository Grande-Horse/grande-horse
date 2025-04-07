package com.example.grandehorse.domain.product.entity.coin;

import jakarta.persistence.Column;
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
@Table(name = "product", indexes = {
	@Index(name = "idx_product_type_typeId", columnList = "type, type_id")
})
@Getter
public class ProductEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Enumerated(EnumType.STRING)
	@Column(name = "type", length = 10, nullable = false)
	private CoinProductType type;

	@Column(name = "type_id", nullable = false)
	private byte typeId;

	@Column(name = "price", nullable = false)
	private int price;

	@Column(name = "selling", nullable = false)
	private boolean selling;
}
