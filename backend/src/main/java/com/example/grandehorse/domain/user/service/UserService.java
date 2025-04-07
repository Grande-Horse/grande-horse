package com.example.grandehorse.domain.user.service;

import java.util.Map;
import java.util.Optional;

import com.example.grandehorse.domain.card.controller.response.CardResponseDto;
import com.example.grandehorse.domain.card.service.CardService;
import com.example.grandehorse.domain.user.controller.response.UserInfoResponse;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.grandehorse.domain.auth.controller.response.SocialUserResponse;
import com.example.grandehorse.domain.user.controller.request.SignUpDto;
import com.example.grandehorse.domain.user.controller.response.CoinResponse;
import com.example.grandehorse.domain.user.entity.SocialProvider;
import com.example.grandehorse.domain.user.entity.UserEntity;
import com.example.grandehorse.domain.user.repository.UserJpaRepository;
import com.example.grandehorse.global.exception.CommonException;
import com.example.grandehorse.global.exception.CustomError;
import com.example.grandehorse.global.exception.UserException;
import com.example.grandehorse.global.jwt.JwtTokenProvider;
import com.example.grandehorse.global.response.CommonResponse;
import com.example.grandehorse.global.util.CookieUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final String SOCIAL_TOKEN = "socialToken";
    private final UserJpaRepository userJpaRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CardService cardService;

    public UserEntity findUserById(int userId) {
        return userJpaRepository.findById(userId).orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));
    }

    @Transactional
    public void purchaseCard(int buyerId, int sellerId, int price) {
        deductCoinForPurchase(buyerId, price);
        addSaleEarningsToCoins(sellerId, price);
    }

    private void deductCoinForPurchase(int buyerId, int price) {
        UserEntity user = userJpaRepository.findByIdWithPessimisticLock(buyerId)
                .orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));

        user.validateCoin(price);
        user.decreaseCoin(price);
        userJpaRepository.save(user);
    }

    private void addSaleEarningsToCoins(int sellerId, int price) {
        UserEntity user = userJpaRepository.findByIdWithPessimisticLock(sellerId)
                .orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));

        user.increaseCoin(price);
        userJpaRepository.save(user);
    }

    public Optional<UserEntity> findUserBySocialInfo(SocialUserResponse socialUserResponse) {
        return userJpaRepository.findBySocialProviderAndSocialId(socialUserResponse.getSocialProvider(),
                socialUserResponse.getSocialId());
    }

    public ResponseEntity<CommonResponse<Void>> isNicknameAvailable(String nickname) {
        validateNicknameLength(nickname);
        validateNicknameDuplicate(nickname);
        return CommonResponse.success(null);
    }

    @Transactional
    public ResponseEntity<CommonResponse<Void>> processSocialSignUp(SignUpDto signUpDto, String socialToken,
                                                                    HttpServletResponse response) {
        validateSocialToken(socialToken);

        String nickname = signUpDto.getNickname();
        validateNicknameLength(nickname);
        validateNicknameDuplicate(nickname);

        Map<String, Object> social = jwtTokenProvider.getPayloadFromToken(socialToken);
        SocialProvider socialProvider = SocialProvider.valueOf(social.get("socialProvider").toString());

        UserEntity userEntity = UserEntity.signUp(social.get("email").toString(), nickname, socialProvider,
                social.get("socialId").toString());

        if (socialProvider == SocialProvider.SSAFY) {
            userEntity.getCoin().increaseCoin(10_000);
        }

        userJpaRepository.save(userEntity);
        CookieUtil.deleteCookie(response, SOCIAL_TOKEN);
        return CommonResponse.success(null);
    }

    private void validateSocialToken(String socialToken) {
        if (socialToken == null || socialToken.isEmpty()) {
            throw new CommonException(CustomError.INVALID_TOKEN);
        }
        jwtTokenProvider.validateToken(socialToken);
    }

    private void validateNicknameLength(String nickname) {
        if (nickname == null || nickname.length() < 3 || nickname.length() > 10) {
            throw new CommonException(CustomError.INPUT_LENGTH_EXCEEDED);
        }
    }

    private void validateNicknameDuplicate(String nickname) {
        userJpaRepository.findByNickname(nickname).ifPresent(user -> {
            throw new UserException(CustomError.USER_DUPLICATE_NICKNAME);
        });
    }

    public ResponseEntity<CommonResponse<CoinResponse>> getUserCoin(int userId) {
        return CommonResponse.success(new CoinResponse(findUserById(userId).getCoin()));
    }

    public void increaseUserCoin(int userId, int price) {
        UserEntity user = userJpaRepository.findByIdWithPessimisticLock(userId)
                .orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));

        user.increaseCoin(price);
        userJpaRepository.save(user);
    }

    public String findNicknameById(int userId) {
        return userJpaRepository.findNicknameById(userId);
    }

    public ResponseEntity<CommonResponse<UserInfoResponse>> getUserInfo(int userId) {
        UserEntity user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new UserException(CustomError.USER_NOT_EXISTED));

        CardResponseDto cardDto = cardService.getRepresentativeCard(userId);

        UserInfoResponse response = new UserInfoResponse(
                user.getId(),
                user.getNickname(),
                user.getCoin().getValue(),
                cardDto
        );

        return CommonResponse.success(response);
    }
}
