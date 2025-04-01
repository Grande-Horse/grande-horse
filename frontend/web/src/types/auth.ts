export interface AutoLoginResponseType {
  errorCode: '' | 'A1' | 'A2';
  // A1, 두 토큰 모두 유효하지 않거나, 두 토큰 모두 존재하지 않음, AuthenticationException
  // A2, 블랙리스트에 등록된 토큰으로 로그인 시,  AuthenticationException
  data: null;
}

export interface KakaoLoginResponseType {
  errorCode: '' | 'A1' | 'A2';
  // A1, 두 토큰 모두 유효하지 않거나, 두 토큰 모두 존재하지 않음, AuthenticationException
  // A2, 블랙리스트에 등록된 토큰으로 로그인 시,  AuthenticationException
  data: null;
}

export interface OAuthCallbackResponse {
  errorCode: '' | 'A1' | 'A2';
  data: {
    redirectUrl: '/' | '/register';
  };
}