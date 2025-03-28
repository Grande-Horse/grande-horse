import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiService';
import { PriceHistoryType, SellHorseType } from '@/types/trading';

export const getPriceHistory = (horseId: string): Promise<PriceHistoryType[]> => {
  return apiGet<PriceHistoryType[]>(`/horses/${horseId}/price-history`);
};

export const sellHorse = async (horse: SellHorseType) => {
  apiPost<SellHorseType>('/trading', horse);
};

export const purchaseHorse = async (tradeId: number) => {
  apiPut(`/trading/${tradeId}`, null);
};

export const cancelHorseSelling = async (tradeId: number) => {
  apiDelete(`/trading/${tradeId}`);
};
