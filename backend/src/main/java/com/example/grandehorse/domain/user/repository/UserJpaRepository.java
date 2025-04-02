package com.example.grandehorse.domain.user.repository;

import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.grandehorse.domain.user.entity.SocialProvider;
import com.example.grandehorse.domain.user.entity.UserEntity;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Integer> {
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT u FROM UserEntity u WHERE u.id = :userId")
	Optional<UserEntity> findByIdWithPessimisticLock(int userId);

	Optional<UserEntity> findBySocialProviderAndSocialId(SocialProvider socialProvider, String socialId);

	@Query("SELECT u.nickname FROM UserEntity u WHERE u.id = :userId")
	String findNicknameById(int userId);

	Optional<UserEntity> findByNickname(String nickname);
}
