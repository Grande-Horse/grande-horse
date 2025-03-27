import { ApiResponseType } from '@/types/service';
import { http, HttpResponse, RequestHandler, StrictResponse } from 'msw';
import { AutoLoginResponseType, KakaoLoginRequestType } from '@/types/auth';

const autoLoginHandler = (): StrictResponse<ApiResponseType<AutoLoginResponseType>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const kakaoLoginHandler = (): StrictResponse<ApiResponseType<KakaoLoginRequestType>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

export const handlers: RequestHandler[] = [
  http.post('/auth/auto-login', autoLoginHandler),
  http.post('/auth/login-kakao', kakaoLoginHandler),
];
