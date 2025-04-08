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
import { Suspense, useState } from 'react';
import Loading from '@/components/ui/Loading';
import { HorseCardType } from '@/types/card';

const SellPanel: React.FC = () => {
  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_TRADING, getMyHorseTrading);
  const [selectedHorse, setSelectedHorse] = useState<HorseCardType | null>(null);

  const { push } = useInternalRouter();
  const { ModalWrapper, openModal, closeModal } = useModal();

  const handleHorseCardClick = (horse: HorseCardType) => {
    setSelectedHorse((prev) => {
      if (prev?.cardId === horse.cardId) {
        return null;
      }
      return horse;
    });
  };

  const handleConfirm = () => {
    if (selectedHorse) {
      push('/market/sell', selectedHorse);
      closeModal(null);
    }
  };

  const handleClose = () => {
    setSelectedHorse(null);
    closeModal(null);
  };

  return (
    <div className='flex h-full flex-col divide-y divide-black'>
      <ModalWrapper>
        <Suspense fallback={<Loading />}>
          <HorseSelectModalContent
            selectedHorse={selectedHorse}
            onHorseCardClick={handleHorseCardClick}
            onClose={handleClose}
            onConfirm={handleConfirm}
          />
        </Suspense>
      </ModalWrapper>

      <section className='flex h-1/3 shrink-0 flex-col items-center justify-center gap-4'>
        <HorseDealIcon />
        <Button onClick={openModal}>말 판매</Button>
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
