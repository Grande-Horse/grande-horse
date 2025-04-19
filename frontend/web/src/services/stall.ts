import { apiGet, apiPost } from '@/services/apiService';
import { HorseCardType } from '@/types/card';
import { RaceRecordType } from '@/types/race';
import { CursorResponse } from '@/types/service/response';

export const getMyHorseCards = async (
  cursorId: number,
  limit: number,
  rank: string
): Promise<CursorResponse<HorseCardType>> => {
  const params = {
    cursorId,
    limit,
    rank,
  };

  return await apiGet<CursorResponse<HorseCardType>>('/cards', params);
};

export const getRaceRecord = async (cardId: number): Promise<RaceRecordType> => {
  return await apiGet<RaceRecordType>(`/cards/${cardId}/race-record`);
};

export const combineCards = async (cardIds: number[]): Promise<HorseCardType> => {
  const body = {
    cardIds,
  };
  return await apiPost<{ cardIds: number[] }, HorseCardType>('/cards/combine', body);
};
