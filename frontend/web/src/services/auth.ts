import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiService';
import { AutoLoginResponseType, KakaoLoginRequestType } from '@/types/auth';

export const postAutoLogin = async () => {
  return apiPost(`/auth/auto-login`, null);
};

export const postKakaoLogin = async () => {
  return apiPost(`/auth/login-kakao`, null);
};
