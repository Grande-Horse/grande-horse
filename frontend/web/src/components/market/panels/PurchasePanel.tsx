import PriceLineChart from '@/components/charts/PriceLineChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';
import { rankMap } from '@/constants/rank';
import { horseMockData } from '@/mocks/datas/horse';
import PurchaseItem from '@/components/market/items/PurchaseItem';
import { HorseType } from '@/types/horse';
import { PriceHistoryType, RegisteredItemType, TradingItemType } from '@/types/trading';
import { useEffect, useState } from 'react';
import SearchIcon from '@/assets/icons/searchIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import { getAllHorseTrading, getPriceHistory } from '@/services/trading';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CursorData } from '@/types/service/response';
import { queryKey } from '@/constants/queryKey';
import { CURSOR_LIMIT } from '@/constants/service';

const PurchasePanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [selectedHorse, setSelectedHorse] = useState<HorseType>(horseMockData);
  const [isPriceHistoryOpen, serIsPriceHistoryOpen] = useState<boolean>(false);

  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKey.TRADING, search, rank],
    queryFn: ({ pageParam }) => getAllHorseTrading(rank, search, pageParam, CURSOR_LIMIT),
    initialPageParam: 0,
    getNextPageParam: (lastPage: CursorData<RegisteredItemType>) =>
      lastPage.hasNextItems ? lastPage.nextCursorId : null,
  });

  useEffect(() => {
    const fetchPriceHistory = async () => {
      const data = await getPriceHistory(selectedHorse.id);
      setPriceHistory(data);
    };

    // fetchPriceHistory();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePriceHistoryClick = () => {
    serIsPriceHistoryOpen((prev) => !prev);
  };

  return (
    <div className='h-full divide-y divide-black'>
      <section className='flex h-1/3 flex-col items-center justify-center gap-4'>
        {/* TODO: 추후 Suspense 및 Error Boundary 적용 */}
        {isPriceHistoryOpen && priceHistory.length > 0 ? (
          <PriceLineChart priceHistory={priceHistory} />
        ) : (
          <>
            <HorseDealIcon />
            <p>말의 변동 시세를 확인해 보세요!</p>
          </>
        )}
      </section>

      <div className='bg-primary flex items-center gap-4 p-4'>
        <Dropdown
          options={Object.values(rankMap)}
          value={rank}
          onChange={setRank}
          placeholder='등급 선택'
          className='w-2/5'
        />
        <Input value={search} onChange={handleSearchChange} />
        <SearchIcon className='cursor-pointer' />
      </div>

      <section className='divide-y-1 divide-black'>
        {data?.pages.flatMap((page) =>
          page.items.map((item) => (
            <PurchaseItem
              key={item.tradeId}
              item={item}
              isPriceHistoryOpen={isPriceHistoryOpen}
              onPriceHistoryClick={handlePriceHistoryClick}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default PurchasePanel;
