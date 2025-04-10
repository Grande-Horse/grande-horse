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
import Input from '@/components/ui/Input';
import useInternalRouter from '@/hooks/useInternalRouter';

const SellPage: React.FC = () => {
  const location = useLocation();
  const state = location.state;

  const [horse] = useState<HorseCardType>(state);
  const [price, setPrice] = useState<number>();

  const { replace } = useInternalRouter();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleSellHorse = async () => {
    if (!price || price <= 0) {
      alert('판매 가격은 0원 이상입니다.');
      return;
    }

    if (price % 10 !== 0) {
      alert('판매 가격은 10원 단위입니다.');
      return;
    }

    try {
      await sellHorse({
        cardId: Number(horse.cardId),
        price: price,
      });
      replace('/market#1');
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

        <div className='bg-gradient mr-8 flex grow flex-col items-center justify-between rounded-sm p-4'>
          <p className='text-stroke'>판매 가격을 설정해 주세요!</p>
          <div className='flex w-full grow items-center justify-center gap-5 px-4'>
            <CoinIcon width={18} />
            <Input value={price} onChange={handlePriceChange} type='number' />
          </div>

          <div className='flex w-full justify-center gap-5'>
            <Button onClick={handleSellHorse} className='px-12'>
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
