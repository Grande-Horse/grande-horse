import PriceLineChart from '@/components/charts/PriceLineChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';
import { rankMap } from '@/constants/rank';
import { horseMockData } from '@/mocks/datas/horse';
import PurchaseItem from '@/components/market/items/PurchaseItem';
import { HorseType } from '@/types/horse';
import { PriceHistoryType } from '@/types/trading';
import { useEffect, useState } from 'react';
import SearchIcon from '@/assets/icons/searchIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import { getPriceHistory } from '@/services/trading';
import useGetAllHorseTrading from '@/hooks/useQueries/useGetAllHorseTrading';
import ClipLoader from 'react-spinners/ClipLoader';
import { useInView } from 'react-intersection-observer';

const PurchasePanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [selectedHorse, setSelectedHorse] = useState<HorseType>(horseMockData);
  const [isPriceHistoryOpen, serIsPriceHistoryOpen] = useState<boolean>(false);

  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);

  const { data, fetchNextPage, hasNextPage } = useGetAllHorseTrading(rank, search);

  const { ref, inView } = useInView();

  useEffect(() => {
    // TODO: 변동 시세 조회 API 연동 (msw test completed)
    const fetchPriceHistory = async () => {
      const data = await getPriceHistory(selectedHorse.id);
      setPriceHistory(data);
    };

    // fetchPriceHistory();
  }, []);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePriceHistoryClick = () => {
    serIsPriceHistoryOpen((prev) => !prev);
  };

  return (
    <div className='h-full'>
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

      <div className='bg-primary flex items-center gap-4 border-t border-b border-black p-4'>
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

      {hasNextPage && (
        <div ref={ref} className='flex w-full justify-center p-8'>
          <ClipLoader size={18} color='#3D4B63' />
        </div>
      )}
    </div>
  );
};

export default PurchasePanel;
