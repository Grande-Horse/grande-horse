export interface AutoLoginResponseType {
  errorCode: '' | 'A1' | 'A2';
  // A1, 두 토큰 모두 유효하지 않거나, 두 토큰 모두 존재하지 않음, AuthenticationException
  // A2, 블랙리스트에 등록된 토큰으로 로그인 시,  AuthenticationException
  data: null;
}

export interface OauthLoginResponseType {
  errorCode: '' | 'A1' | 'A2';
  // A1, 두 토큰 모두 유효하지 않거나, 두 토큰 모두 존재하지 않음, AuthenticationException
  // A2, 블랙리스트에 등록된 토큰으로 로그인 시,  AuthenticationException
  data: null;
}

export interface CheckDuplicatedNicknameResponseType {
  errorCode: 'C1' | 'C2' | 'U4';
  data: {
    isDuplicated: boolean;
  };
}

export interface RegisterResponseType {
  errorCode: 'U1' | 'U2' | 'U3';
  data: null;
}

