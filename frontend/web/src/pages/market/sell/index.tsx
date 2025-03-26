import HorseProfileCard from '@/components/cards/HorseProfileCard';
import { Button } from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { sellTabList } from '@/constants/tabList';
import { horseListMockData, horseMockData } from '@/mocks/datas/horse';
import TradingItem from '@/pages/market/items/TradingItem';
import { HorseType } from '@/types/horse';
import { useState } from 'react';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import PriceBarChart from '@/components/charts/PriceBarChart';
import { PriceHistoryType } from '@/types/trading';
import { priceHistoryMockData } from '@/mocks/datas/trading';
import { cancelHorseSelling, sellHorse } from '@/services/trading';

const SellPage: React.FC = () => {
  const [horse, setHorse] = useState<HorseType>(horseMockData);
  const [horseTradingHistory, setHorseTradingHistory] = useState<HorseType[]>(horseListMockData);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>(priceHistoryMockData);

  const handleCancelHorseSelling = async () => {
    const tradeId = 3;

    try {
      await cancelHorseSelling(tradeId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSellHorse = async () => {
    try {
      await sellHorse({
        horseId: '0058000',
        cardId: 2,
        sellerId: 2,
        price: 500,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='h-body flex flex-col'>
      <section className='flex gap-4 py-5'>
        <div>
          <HorseProfileCard name={horse.name} rank={horse.rank} coatColor={horse.coatColor} />
        </div>

        <div className='bg-gradient mr-8 flex grow flex-col items-center justify-between rounded-sm p-2'>
          <Price label='평균가' price={300} />
          <Price label='최저가' price={200} />
          <Price label='최고가' price={400} />

          {/* TODO: 버튼 반응형 구현 */}
          <div className='flex w-full justify-center gap-5 p-2'>
            <Button onClick={handleCancelHorseSelling} className='w-full'>
              말 변경
            </Button>
            <Button onClick={handleSellHorse} className='w-full'>
              판매
            </Button>
          </div>
        </div>
      </section>

      <Tabs
        tabList={sellTabList}
        tabPanels={[
          <PriceBarChart priceHistory={priceHistory} />,
          <div className='divide-y-1 divide-black'>
            {horseTradingHistory.map((horse) => (
              <TradingItem key={horse.id} horse={horse} price={300} />
            ))}
          </div>,
        ]}
      />
    </div>
  );
};

export default SellPage;

interface PriceProps {
  label: string;
  price: number;
}

const Price: React.FC<PriceProps> = ({ label, price }) => {
  return (
    <div className='-mt-1 flex w-full items-center justify-between gap-2 px-4'>
      <p className='text-stroke'>{label}</p>
      <span className='flex items-center gap-2'>
        <CoinIcon width={18} />
        <p>{price}</p>
      </span>
    </div>
  );
};
