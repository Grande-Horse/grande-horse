package com.example.grandehorse.domain.product.service;

import org.springframework.stereotype.Service;

import com.example.grandehorse.domain.product.entity.cash.CashProductEntity;
import com.example.grandehorse.domain.product.repository.CashProductRepository;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.ProductException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final CashProductRepository cashProductRepository;

	public CashProductEntity gettCashProductById(Byte id) {
		return cashProductRepository.findCashProductById(id)
			.orElseThrow(() -> new ProductException(CustomError.PRODUCT_NOT_FOUND));
	}
}
