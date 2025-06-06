import SmallHorseCard from '@/components/cards/SmallHorseCard';
import { ClipLoader } from 'react-spinners';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';
import { HorseCardType } from '@/types/card';
import useGetMyHorseCards from '@/hooks/useQueries/useGetMyHorseCards';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ui/modal/ConfirmDialog';
import { useDialog } from '@/contexts/confirmDialogContext';
import useInternalRouter from '@/hooks/useInternalRouter';

const HorseSelectModal: React.FC = () => {
  const { data, fetchNextPage, hasNextPage } = useGetMyHorseCards('all');

  const { ref, inView } = useInView();

  const [selectedHorse, setSelectedHorse] = useState<HorseCardType>();
  const { closeDialog } = useDialog();
  const { push } = useInternalRouter();

  const handleConfirm = () => {
    closeDialog();
    push('/market/sell', selectedHorse);
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <ConfirmDialog onConfirm={handleConfirm} confirmText='선택'>
      <p className='text-heading4 text-stroke pb-6'>판매할 말을 선택해 주세요!</p>
      <div className='scrollbar-hide flex max-h-[36rem] flex-col gap-6 overflow-y-auto'>
        <section className='grid grid-cols-2 place-items-center gap-5'>
          {data?.pages.flatMap((page) =>
            page.items
              .filter((item) => item.status === 0)
              .map((item) => (
                <div className='relative' key={item.cardId}>
                  <div
                    className='absolute top-1 z-10 flex h-66 w-44 cursor-pointer items-center justify-center rounded-xl bg-black/60'
                    style={{
                      opacity: selectedHorse?.cardId === item.cardId ? 1 : 0,
                      pointerEvents: selectedHorse?.cardId === item.cardId ? 'auto' : 'none',
                    }}
                  >
                    <SelectedIcon />
                  </div>

                  <SmallHorseCard horse={item} onClick={setSelectedHorse} />
                </div>
              ))
          )}
        </section>

        {hasNextPage && (
          <div ref={ref} className='flex w-full justify-center p-8'>
            <ClipLoader size={18} color='#3D4B63' />
          </div>
        )}
      </div>
    </ConfirmDialog>
  );
};

export default HorseSelectModal;
