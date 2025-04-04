import { apiPost } from '@/services/apiService';

export const buyCardpack = async (cardpackId: number) => {
  const body = { id: cardpackId };
  apiPost<{ id: number }, null>('/purchases/cardpack/coin', body);
};
export const buyDailyCardpack = async () => {
  apiPost<null, null>('/purchases/cardpack/daily', null);
};
