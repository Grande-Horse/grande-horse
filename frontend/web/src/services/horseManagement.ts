import { apiDelete, apiGet, apiPut } from '@/services/apiService';
import { ApiResponse, CursorResponse } from '@/types/service/response';
import { CandidateHorseType } from '@/types/horse';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { queryKey } from '@/constants/queryKey';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

export const getAllCandidateHorses = async (): Promise<ApiResponse<CandidateHorseType[]>> => {
  return await apiGet<ApiResponse<CandidateHorseType[]>>('/cards/candidate');
};

export const putCandidateHorse = async (cardId: number) => {
  return await apiPut(`/cards/${cardId}/candidate`, null);
};

export const setRepresentativeHorse = async (cardId: number) => {
  return await apiPut(`/cards/${cardId}/representative`, null);
};

export const unsetRepresentativeHorse = async (cardId: number) => {
  return await apiPut(`/cards/representative/unset`, null);
};

export const useCandidateHorses = () => {
  return useQuery({
    queryKey: ['candidateHorses'],
    queryFn: async () => {
      const response = await getAllCandidateHorses();
      return response;
    },
  });
};

export const useUpdateCandidateHorse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: number) => {
      return putCandidateHorse(cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidateHorses'] });
      queryClient.invalidateQueries({ queryKey: [queryKey.MY_HORSE_CARDS] });
    },
    onError: (error: Error) => {
      console.log(error);
      const serverError = error.response?.data;
      if (serverError?.errorCode === 'CA5') {
        alert('출전마는 후보마에서 해제할 수 없습니다.');
      } else if (serverError?.errorCode === 'CA6') {
        alert('후보마는 6마리까지만 추가할 수 있습니다.');
      } else {
        alert(serverError?.message || '알 수 없는 오류가 발생했습니다.');
      }
    },
  });
};

export const useRepresentativeHorse = () => {
  const queryClient = useQueryClient();
  const { refetch } = useUserInfo();
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
        refetch();
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
