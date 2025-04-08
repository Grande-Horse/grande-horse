import { queryKey } from '@/constants/queryKey';
import { CURSOR_LIMIT } from '@/constants/service';
import { getAllHorseTrading } from '@/services/trading';
import { CursorResponse } from '@/types/service/response';
import { RegisteredItemType } from '@/types/trading';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

const useGetAllHorseTrading = (rank: string, search: string) => {
  const { data, isFetching, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: [queryKey.TRADING, rank, search],
    queryFn: ({ pageParam }) => getAllHorseTrading(rank, search, pageParam, CURSOR_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CursorResponse<RegisteredItemType>) =>
      lastPage.hasNextItems ? lastPage.nextCursorId : null,
  });

  return { data, isFetching, fetchNextPage, hasNextPage };
};

export default useGetAllHorseTrading;
