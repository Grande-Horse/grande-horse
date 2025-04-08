import HorseProfileCard from '@/components/cards/HorseProfileCard';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import { Button } from '@/components/ui/Button';
import { sellHorse } from '@/services/trading';
import Tabs from '@/components/ui/Tabs';
import { sellTabList } from '@/constants/tabList';
import { useLocation } from 'react-router-dom';
import TradeListPanel from '@/components/market/panels/TradeListPanel';
import PriceHistoryPanel from '@/components/market/panels/PriceHistoryPanel';
import { useState } from 'react';
import { HorseCardType } from '@/types/card';

const SellPage: React.FC = () => {
  const location = useLocation();
  const state = location.state;

  const [horse] = useState<HorseCardType>(state);

  const handleSellHorse = async () => {
    try {
      await sellHorse({
        cardId: Number(horse.cardId),
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
          <HorseProfileCard name={horse.name} rank={horse.horseRank} coatColor={horse.coatColor} />
        </div>

        <div className='bg-gradient mr-8 flex grow flex-col items-center justify-between rounded-sm p-2'>
          <Price label='평균가' price={300} />
          <Price label='최저가' price={200} />
          <Price label='최고가' price={400} />

          <div className='flex w-full justify-center gap-5 p-2'>
            <Button onClick={handleSellHorse} className='w-full'>
              판매하기
            </Button>
          </div>
        </div>
      </section>

      <Tabs
        tabList={sellTabList}
        tabPanels={[<PriceHistoryPanel horseId={horse.horseId} />, <TradeListPanel horseId={horse.horseId} />]}
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
