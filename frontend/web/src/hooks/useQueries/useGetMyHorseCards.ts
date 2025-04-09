import { queryKey } from '@/constants/queryKey';
import { CURSOR_LIMIT } from '@/constants/service';
import { getMyHorseCards } from '@/services/stall';
import { HorseCardType } from '@/types/card';
import { CursorResponse } from '@/types/service/response';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

const useGetMyHorseCards = (rank: string) => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: [queryKey.MY_HORSE_CARDS, rank],
    queryFn: ({ pageParam }) => getMyHorseCards(pageParam, CURSOR_LIMIT, rank),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CursorResponse<HorseCardType>) =>
      lastPage.hasNextItems ? lastPage.nextCursorId : null,
  });

  return { data, isFetching, fetchNextPage, hasNextPage };
};

export default useGetMyHorseCards;
