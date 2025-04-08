import { apiDelete, apiGet, apiPut } from '@/services/apiService';
import { ApiResponse, CursorResponse } from '@/types/service/response';
import { CandidateHorseType } from '@/types/horse';

export const getAllCandidateHorses = async (): Promise<ApiResponse<CandidateHorseType[]>> => {
  return apiGet<ApiResponse<CandidateHorseType[]>>('/cards/candidate');
};

export const putCandidateHorse = async (cardId: number) => {
  return apiPut(`/cards/${cardId}/candidate`, null);
};

export const setRepresentativeHorse = async (cardId: number) => {
  apiPut(`/cards/${cardId}/representative`, null);
};

export const unsetRepresentativeHorse = async (cardId: number) => {
  apiPut(`/cards/representative/unset`, null);
};
