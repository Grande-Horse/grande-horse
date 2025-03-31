import HorseProfileCard from '@/components/cards/HorseProfileCard';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { HorseType } from '@/types/horse';
import { horseMockData } from '@/mocks/datas/horse';
import { getPriceHistory, sellHorse } from '@/services/trading';
import Tabs from '@/components/ui/Tabs';
import { sellTabList } from '@/constants/tabList';
import PriceBarChart from '@/components/charts/PriceBarChart';
import { PriceHistoryType } from '@/types/trading';
import useGetHorseTrading from '@/hooks/useQueries/useGetHorseTrading';
import { useInView } from 'react-intersection-observer';
import { ClipLoader } from 'react-spinners';
import { useParams } from 'react-router-dom';
import TradeList from '@/components/market/list/TradeList';

const SellPage: React.FC = () => {
  const { horseId } = useParams<{ horseId: string }>();

  const [horse, setHorse] = useState<HorseType>(horseMockData);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryType[]>([]);

  const { data, fetchNextPage, hasNextPage } = useGetHorseTrading(horseId!);

  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchPriceHistory = async () => {
      const data = await getPriceHistory(horseId!);
      setPriceHistory(data);
    };

    fetchPriceHistory();
  }, [horseId]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

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

          <div className='flex w-full justify-center gap-5 p-2'>
            <Button onClick={handleSellHorse} className='w-full'>
              판매하기
            </Button>
          </div>
        </div>
      </section>

      <Tabs
        tabList={sellTabList}
        tabPanels={[
          <PriceBarChart priceHistory={priceHistory} />,
          <>
            <TradeList data={data} />
            {hasNextPage && (
              <div ref={ref} className='flex w-full justify-center p-8'>
                <ClipLoader size={18} color='#3D4B63' />
              </div>
            )}
          </>,
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
