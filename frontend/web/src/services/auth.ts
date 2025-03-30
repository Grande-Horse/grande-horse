import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiService';
import { AutoLoginResponseType, CheckDuplicatedNicknameResponseType } from '@/types/auth';

export const autoLogin = async () => {
  return apiGet(`/auth/auto-login`);
};

export const oauthLogin = async (provider: string) => {
  return apiGet(`/auth/login-${provider}`);
};

export const checkNicknameDuplicated = async (nickname: string) => {
  return apiGet(`/users/${nickname}/duplicate`);
};

export const registerUser = (nickname: string) => {
  return apiPost('/users', { nickname });
};


