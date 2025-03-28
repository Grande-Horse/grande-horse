import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiService';
import { AutoLoginResponseType } from '@/types/auth';

export const postAutoLogin = async () => {
  return apiPost(`/auth/auto-login`, null);
};

export const postOauthLogin = async (provider: string) => {
  return apiPost(`/auth/login-${provider}`, null);
};
