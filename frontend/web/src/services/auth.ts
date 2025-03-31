import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiService';
import { AutoLoginResponseType, CheckDuplicatedNicknameResponseType } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

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


