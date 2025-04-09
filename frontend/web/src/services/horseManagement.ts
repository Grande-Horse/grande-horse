import { apiDelete, apiGet, apiPut } from '@/services/apiService';
import { ApiResponse, CursorResponse } from '@/types/service/response';
import { CandidateHorseType } from '@/types/horse';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { queryKey } from '@/constants/queryKey';

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

export const useCandidateHorses = () => {
  return useQuery({
    queryKey: ['candidateHorses'],
    queryFn: async () => {
      const response = await getAllCandidateHorses();
      return response.data;
    },
  });
};

export const useUpdateCandidateHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: number) => {
      const currentCandidates = queryClient.getQueryData<CandidateHorseType[]>(['candidateHorses']) || [];
      const isAlreadyCandidateHorse = currentCandidates.some((horse) => horse.cardId === cardId);

      if (!isAlreadyCandidateHorse && currentCandidates.length >= 6) {
        throw new Error(`후보 말은 6마리까지만 추가할 수 있습니다.`);
      }

      return putCandidateHorse(cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidateHorses'] });
      queryClient.invalidateQueries({ queryKey: [queryKey.MY_HORSE_CARDS] });
    },
    onError: (error: Error) => {
      const serverError = error.response?.data;
      if (serverError?.errorCode === 'CA5') {
        alert('경주마는 후보 말에서 해제할 수 없습니다.');
      } else {
        alert(serverError?.message || '알 수 없는 오류가 발생했습니다.');
      }
    },
  });
};

export const useRepresentativeHorse = () => {
  const queryClient = useQueryClient();

  return {
    setRepresentative: useMutation({
      mutationFn: async (cardId: number) => {
        const currentCandidates = queryClient.getQueryData<CandidateHorseType[]>(['candidateHorses']) || [];
        const currentRep = currentCandidates.find((horse) => horse.status === 3);

        // 기존 경주마가 있고, 새로 지정하려는 말이 다른 말이면 먼저 해제
        if (currentRep && currentRep.cardId !== cardId) {
          await unsetRepresentativeHorse(currentRep.cardId);
        }

        return setRepresentativeHorse(cardId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['candidateHorses'] });
        queryClient.invalidateQueries({ queryKey: [queryKey.MY_HORSE_CARDS] });
      },
      onError: (error: Error) => {
        alert(error.message);
      },
    }),
    unsetRepresentative: useMutation({
      mutationFn: (cardId: number) => unsetRepresentativeHorse(cardId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['candidateHorses'] });
        queryClient.invalidateQueries({ queryKey: [queryKey.MY_HORSE_CARDS] });
      },
      onError: (error: Error) => {
        alert(error.message);
      },
    }),
  };
};