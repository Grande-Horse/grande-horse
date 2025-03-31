import { Button } from '@/components/ui/Button';
import useInternalRouter from '@/hooks/useInternalRouter';
import SellItem from '@/components/market/items/SellItem';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { queryKey } from '@/constants/queryKey';
import { getMyHorseTrading } from '@/services/trading';
import { ClipLoader } from 'react-spinners';
import useModal from '@/components/ui/modal/useModal';
import HorseSelectModalContent from '@/components/market/modal/HorseSelectModalContent';
import { HorseType } from '@/types/horse';
import { Suspense, useState } from 'react';
import Loading from '@/components/ui/Loading';

const SellPanel: React.FC = () => {
  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_TRADING, getMyHorseTrading);
  const [selectedHorse, setSelectedHorse] = useState<HorseType | null>(null);

  const { push } = useInternalRouter();
  const { openModal } = useModal();

  const handleHorseCardClick = (horse: HorseType | null) => {
    setSelectedHorse(horse);
  };

  const handleSellButtonClick = () => {
    openModal({
      title: <p className='text-stroke'>판매할 말을 선택해 주세요!</p>,
      confirmText: '선택',
      content: (
        <Suspense fallback={<Loading />}>
          <HorseSelectModalContent selectedHorse={selectedHorse} onHorseCardClick={handleHorseCardClick} />
        </Suspense>
      ),
      onConfirm: () => {
        if (selectedHorse) {
          push(`/market/sell/${selectedHorse.id}`);
        }
      },
      onCancel: () => {
        setSelectedHorse(null);
      },
    });
  };

  return (
    <div className='flex h-full flex-col divide-y divide-black'>
      <section className='flex h-1/3 shrink-0 flex-col items-center justify-center gap-4'>
        <HorseDealIcon />
        <Button onClick={handleSellButtonClick}>말 판매</Button>
      </section>

      <div className='bg-primary flex items-center gap-4 p-4'>
        <p className='text-stroke text-body2'>말 판매 내역</p>
      </div>

      <section className='divide-y-1 divide-black'>
        {data?.pages.flatMap((page) => page.items.map((item) => <SellItem key={item.tradeId} item={item} />))}
      </section>

      {hasNextPage && (
        <div ref={ref} className='flex w-full justify-center p-8'>
          <ClipLoader size={18} color='#3D4B63' />
        </div>
      )}
    </div>
  );
};

export default SellPanel;
