import { apiPost } from '@/services/apiService';

export const buyCardpack = async (cardpackId: number) => {
  const body = { id: cardpackId };
  const response = await apiPost<{ id: number }, null>('/purchases/cardpack/coin', body);
  return response;
};
export const buyDailyCardpack = async () => {
  return await apiPost<null, null>('/purchases/cardpack/daily', null);
};
