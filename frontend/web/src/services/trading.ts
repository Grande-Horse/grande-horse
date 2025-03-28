import { apiDelete, apiGet, apiPost, apiPut } from '@/services/apiService';
import { SellHorseRequest } from '@/types/service/request';
import { CursorData } from '@/types/service/response';
import { SoldItemType, PriceHistoryType, RegisteredItemType } from '@/types/trading';

export const getAllHorseTrading = async (
  rank: string,
  search: string,
  cursorId: number,
  limit: number
): Promise<CursorData<RegisteredItemType>> => {
  const params = {
    rank,
    search,
    cursorId,
    limit,
  };

  return apiGet<CursorData<RegisteredItemType>>('/tradings', params);
};

export const getHorseTrading = async (
  horseId: string,
  cursorId: number,
  limit: number
): Promise<CursorData<SoldItemType>> => {
  const params = {
    cursorId,
    limit,
  };

  return apiGet<CursorData<SoldItemType>>(`/tradings/${horseId}/sold-cards`, params);
};

export const getMyHorseTrading = async (cursorId: number, limit: number): Promise<CursorData<RegisteredItemType>> => {
  const params = {
    cursorId,
    limit,
  };

  return apiGet<CursorData<RegisteredItemType>>('/tradings/registered-cards', params);
};

export const getPriceHistory = (horseId: string): Promise<PriceHistoryType[]> => {
  return apiGet<PriceHistoryType[]>(`/horses/${horseId}/price-history`);
};

export const sellHorse = async (horse: SellHorseRequest) => {
  apiPost<SellHorseRequest>('/tradings', horse);
};

export const purchaseHorse = async (tradeId: number) => {
  apiPut(`/tradings/${tradeId}`, null);
};

export const cancelHorseSelling = async (tradeId: number) => {
  apiDelete(`/tradings/${tradeId}`);
};
