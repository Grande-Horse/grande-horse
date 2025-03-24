import PriceChart from '@/components/charts/PriceChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { RankMap } from '@/constants/horse';
import { horseListMockData } from '@/mocks/datas/horse';
import { priceHistoryMockData } from '@/mocks/datas/trading';
import TradingItem from '@/pages/market/trading/TradingItem';
import { HorseType } from '@/types/horse';
import { PriceHistoryType } from '@/types/trading';
import { useState } from 'react';

const TradingPanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');

  const [horseList, setHorseList] = useState<HorseType[]>(horseListMockData);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>(priceHistoryMockData);

  return (
    <div className='divide-y-1 divide-black'>
      <div className='bg-primary p-4'>
        <Dropdown options={Object.values(RankMap)} value={rank} onChange={setRank} placeholder='등급 선택' />
        {/* TODO: Search Input */}
      </div>

      <section className='p-4'>
        <PriceChart priceHistory={priceHistory} />
      </section>

      <section className='divide-y-1 divide-black'>
        {horseList.map((horse) => (
          <TradingItem key={horse.id} horse={horse} price={300} />
        ))}
      </section>
    </div>
  );
};

export default TradingPanel;
