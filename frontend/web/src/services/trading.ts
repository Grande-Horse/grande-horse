import { apiGet } from '@/services/apiService';
import { PriceHistoryType } from '@/types/trading';

export const getPriceHistory = (horseId: string): Promise<PriceHistoryType[]> => {
  return apiGet<PriceHistoryType[]>(`/api/v1/horses/${horseId}/price-history`);
};
