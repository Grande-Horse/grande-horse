import { apiGet, apiPost } from '@/services/apiService';

export const autoLogin = async () => {
  return apiGet(`/auth/auto-login`);
};

interface OauthLoginRequestType {
  socialProvider: string;
  code: string;
}

export const oauthLogin = async (request: OauthLoginRequestType) => {
  return apiPost(`/auth/login`, request);
};

export const checkNicknameDuplicated = async (nickname: string) => {
  return apiGet(`/users/${nickname}/duplicate`);
};

export const registerUser = (nickname: string) => {
  return apiPost('/users', { nickname });
};
