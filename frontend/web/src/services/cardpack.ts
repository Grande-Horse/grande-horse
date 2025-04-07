import { apiPost } from '@/services/apiService';

export const buyCardpack = async (cardpackId: number) => {
  const body = { id: cardpackId };
  await apiPost<{ id: number }, null>('/purchases/cardpack/coin', body);
};
export const buyDailyCardpack = async () => {
  await apiPost<null, null>('/purchases/cardpack/daily', null);
};
