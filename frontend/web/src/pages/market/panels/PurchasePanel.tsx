import PriceLineChart from '@/components/charts/PriceLineChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';
import { RankMap } from '@/constants/horse';
import { horseListMockData, horseMockData } from '@/mocks/datas/horse';
import TradingItem from '@/pages/market/items/TradingItem';
import { HorseType } from '@/types/horse';
import { PriceHistoryType } from '@/types/trading';
import { useEffect, useState } from 'react';
import SearchIcon from '@/assets/icons/searchIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import { Button } from '@/components/ui/Button';
import useInternalRouter from '@/hooks/useInternalRouter';
import { getPriceHistory } from '@/services/trading';

const PurchasePanel: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [rank, setRank] = useState<string>('');

  const [horseList, setHorseList] = useState<HorseType[]>(horseListMockData);
  const [selectedHorse, setSelectedHorse] = useState<HorseType>(horseMockData);
  const [isPriceHistoryOpen, serIsPriceHistoryOpen] = useState<boolean>(false);

  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      const data = await getPriceHistory(selectedHorse.id);
      setPriceHistory(data);
    };

    fetchPriceHistory();
  }, []);

  const { push } = useInternalRouter();

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handlePriceHistoryClick = () => {
    serIsPriceHistoryOpen((prev) => !prev);
  };

  return (
    <div className='h-full divide-y-1 divide-black'>
      <div className='bg-primary flex items-center gap-4 p-4'>
        <Dropdown
          options={Object.values(RankMap)}
          value={rank}
          onChange={setRank}
          placeholder='등급 선택'
          className='w-2/5'
        />
        <Input value={keyword} onChange={handleKeywordChange} />
        <SearchIcon className='cursor-pointer' />
      </div>

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

      <section className='divide-y-1 divide-black'>
        {horseList.map((horse) => (
          <TradingItem
            key={horse.id}
            horse={horse}
            price={300}
            isPriceHistoryOpen={isPriceHistoryOpen}
            onPriceHistoryClick={handlePriceHistoryClick}
          />
        ))}
      </section>
    </div>
  );
};

export default PurchasePanel;
