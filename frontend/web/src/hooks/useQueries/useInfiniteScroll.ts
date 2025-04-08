import { CURSOR_LIMIT } from '@/constants/service';
import { CursorResponse } from '@/types/service/response';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

type FetchFnType = (pageParam: number, limit: number, ...params: any) => Promise<CursorResponse<any>>;

const useInfiniteScroll = (queryKey: string, fetchFn: FetchFnType, ...params: any) => {
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery({
    queryKey: [queryKey, ...params],
    queryFn: ({ pageParam }) => fetchFn(pageParam, CURSOR_LIMIT, ...params),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CursorResponse<any>) => (lastPage.hasNextItems ? lastPage.nextCursorId : null),
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return { data, hasNextPage, ref };
};

export default useInfiniteScroll;
