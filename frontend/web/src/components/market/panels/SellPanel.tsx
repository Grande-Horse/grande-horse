import { Button } from '@/components/ui/Button';
import { horseListMockData, horseMockData } from '@/mocks/datas/horse';
import { HorseType } from '@/types/horse';
import { useState } from 'react';
import useInternalRouter from '@/hooks/useInternalRouter';
import SellItem from '@/components/market/items/SellItem';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';

const SellPanel: React.FC = () => {
  const [horseList, setHorseList] = useState<HorseType[]>(horseListMockData);

  const { push } = useInternalRouter();

  return (
    <div className='flex h-full flex-col divide-y divide-black'>
      <section className='flex h-1/3 shrink-0 flex-col items-center justify-center gap-4'>
        <HorseDealIcon />
        <Button onClick={() => push('/market/sell')}>말 판매</Button>
      </section>

      <div className='bg-primary flex items-center gap-4 p-4'>
        <p className='text-stroke text-body2'>말 판매 내역</p>
      </div>

      <section className='divide-y-1 divide-black'>
        {horseList.map((horse, index) => (
          <SellItem key={horse.id} horse={horse} price={300} isSold={index % 2 === 1} />
        ))}
      </section>
    </div>
  );
};

export default SellPanel;
