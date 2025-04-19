import { ApiResponseType } from '@/types/service';
import { http, HttpResponse, RequestHandler, StrictResponse } from 'msw';
import { AutoLoginResponseType, CheckDuplicatedNicknameResponseType, OauthLoginResponseType } from '@/types/auth';

const autoLoginHandler = () => {
  return HttpResponse.json<ApiResponseType<AutoLoginResponseType>>({
    errorCode: '',
    data: null,
  });
};
const oauthLoginHandler = () => {
  return HttpResponse.json<ApiResponseType<OauthLoginResponseType>>({
    errorCode: '',
    data: null,
  });
};

const checkNicknameDuplicatedHandler = () => {
  return HttpResponse.json({
    errorCode: '',
    data: {
      isDuplicated: false,
    },
  });
};

const registerHandler = () => {
  return HttpResponse.json({
    errorCode: '',
    data: null,
  });
};

export const handlers: RequestHandler[] = [
  http.post('/auth/auto-login', autoLoginHandler),
  http.get('/auth/login-:provider', oauthLoginHandler),
  http.get('/users/:nickname/duplicate', checkNicknameDuplicatedHandler),
  http.post('/users', registerHandler),
];
