import { ApiResponseType } from '@/types/service';
import { http, HttpResponse, RequestHandler, StrictResponse } from 'msw';
import { AutoLoginResponseType, KakaoLoginResponseType } from '@/types/auth';

const autoLoginHandler = () => {
  return HttpResponse.json<ApiResponseType<AutoLoginResponseType>>({
    data: {
      errorCode: '',
      data: null,
    },
  });
};
const kakaoLoginHandler = () => {
  return HttpResponse.json<ApiResponseType<KakaoLoginResponseType>>({
    data: {
      errorCode: 'A1',
      data: null,
    },
  });
};

export const handlers: RequestHandler[] = [
  http.post('/auth/auto-login', autoLoginHandler),
  http.post('/auth/login-kakao', kakaoLoginHandler),
];
