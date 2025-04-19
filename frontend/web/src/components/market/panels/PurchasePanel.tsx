import PriceLineChart from '@/components/charts/PriceLineChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';
import { rankMap, rankNameMap } from '@/constants/rank';
import PurchaseItem from '@/components/market/items/PurchaseItem';
import { PriceHistoryType } from '@/types/trading';
import { useEffect, useState } from 'react';
import SearchIcon from '@/assets/icons/searchIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import { getPriceHistory } from '@/services/trading';
import useGetAllHorseTrading from '@/hooks/useQueries/useGetAllHorseTrading';
import ClipLoader from 'react-spinners/ClipLoader';
import { useInView } from 'react-intersection-observer';
import { isExistPriceHistory } from '@/utils/trading';

const PurchasePanel: React.FC = () => {
  const [rank, setRank] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const { data: tradingList, fetchNextPage, hasNextPage } = useGetAllHorseTrading(rank, search);

  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);
  const [selectedHorse, setSelectedHorse] = useState<string>('');

  const [error, setError] = useState<Error | null>(null);

  const { ref, inView } = useInView();

  if (error) {
    throw error;
  }

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const handleSearch = () => {
    setSearch(keyword);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleRankChange = (rank: string) => {
    setRank(rankNameMap[rank as keyof typeof rankNameMap]);
  };

  const fetchPriceHistory = async (horseId: string) => {
    try {
      const data = await getPriceHistory(horseId);
      setPriceHistory(data);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handlePriceHistoryClick = async (horseId: string) => {
    if (!selectedHorse) {
      await fetchPriceHistory(horseId);
      setSelectedHorse(horseId);
    } else {
      setSelectedHorse('');
    }
  };

  return (
    <div className='h-full'>
      <section className='flex h-1/3 flex-col items-center justify-center gap-4'>
        {selectedHorse && priceHistory.length > 0 ? (
          isExistPriceHistory(priceHistory) ? (
            <PriceLineChart priceHistory={priceHistory} />
          ) : (
            <>
              <HorseDealIcon />
              <p>말의 최근 거래 내역이 없습니다!</p>
            </>
          )
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
          value={rankNameMap[rank as keyof typeof rankNameMap]}
          onChange={handleRankChange}
          placeholder='전체'
          className='w-2/5'
        />
        <Input value={keyword} onChange={handleKeywordChange} />
        <SearchIcon onClick={handleSearch} className='cursor-pointer' />
      </div>

      <section className='divide-y-1 divide-black'>
        {tradingList?.pages.flatMap((page) =>
          page.items.map((item) => (
            <PurchaseItem
              key={item.tradeId}
              item={item}
              isPriceHistoryOpen={selectedHorse === item.horseId}
              onPriceHistoryClick={() => handlePriceHistoryClick(item.horseId)}
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
