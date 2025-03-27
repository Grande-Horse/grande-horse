export interface AutoLoginResponseType {
  status: 200 | 400;
  response: {
    errorCode: '' | 'A1' | 'A2';
    // A1, 두 토큰 모두 유효하지 않거나, 두 토큰 모두 존재하지 않음, AuthenticationException
    // A2, 블랙리스트에 등록된 토큰으로 로그인 시,  AuthenticationException
    data: {};
  };
}

export interface AutoLoginRequestType {
  method: 'POST';
  headers: {
    Host: 'URL';
    'Content-Type': 'application/json';
  };
}

export interface KakaoLoginRequestType {
  method: 'POST';
  headers: {
    Host: 'URL';
    'Content-Type': 'application/json';
  };
  body: null;
}
