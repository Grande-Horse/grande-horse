import { apiGet } from '@/services/apiService';
import type UserInfoData from '@/types/user';

export const getUserInfo = (): Promise<UserInfoData | null> => {
  return apiGet<UserInfoData | null>('/users/info');
};
