import { apiGet } from '@/services/apiService';
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

  return apiGet<CursorResponse<HorseCardType>>('/cards', params);
};

export const getRaceRecord = async (cardId: number): Promise<RaceRecordType> => {
  return apiGet<RaceRecordType>(`/cards/${cardId}/race-record`);
};
