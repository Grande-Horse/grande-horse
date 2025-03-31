import { queryKey } from '@/constants/queryKey';
import { CURSOR_LIMIT } from '@/constants/service';
import { getHorseTrading } from '@/services/trading';
import { CursorResponse } from '@/types/service/response';
import { SoldItemType } from '@/types/trading';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

const useGetHorseTrading = (horseId: string) => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: [queryKey.TRADING, horseId],
    queryFn: ({ pageParam }) => getHorseTrading(horseId, pageParam, CURSOR_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CursorResponse<SoldItemType>) =>
      lastPage.hasNextItems ? lastPage.nextCursorId : null,
  });

  return { data, isFetching, fetchNextPage, hasNextPage };
};

export default useGetHorseTrading;
