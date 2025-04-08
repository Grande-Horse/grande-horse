import SmallHorseCard from '@/components/cards/SmallHorseCard';
import { ClipLoader } from 'react-spinners';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';
import { HorseCardType } from '@/types/card';
import { Button } from '@/components/ui/Button';
import useGetMyHorseCards from '@/hooks/useQueries/useGetMyHorseCards';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface HorseSelectModalContentProps {
  selectedHorse: HorseCardType | null;
  onHorseCardClick: (horse: HorseCardType) => void;
  onConfirm?: () => void;
  onClose?: () => void;
}

const HorseSelectModalContent: React.FC<HorseSelectModalContentProps> = ({
  selectedHorse,
  onHorseCardClick,
  onConfirm,
  onClose,
}) => {
  const { data, fetchNextPage, hasNextPage } = useGetMyHorseCards('all');

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <div className='flex max-h-[44rem] flex-col gap-6'>
      <p className='text-heading4 text-stroke'>판매할 말을 선택해 주세요!</p>
      <section className='scrollbar-hide grid grid-cols-2 place-items-center gap-5 overflow-y-auto'>
        {data?.pages.flatMap((page) =>
          page.items.map((item) => (
            <div className='relative' key={item.cardId}>
              <div
                onClick={() => onHorseCardClick(item)}
                className='absolute top-1 z-10 flex h-66 w-44 cursor-pointer items-center justify-center rounded-sm bg-black/20'
                style={{
                  opacity: selectedHorse?.cardId === item.cardId ? 1 : 0,
                  pointerEvents: selectedHorse?.cardId === item.cardId ? 'auto' : 'none',
                }}
              >
                <SelectedIcon />
              </div>

              <SmallHorseCard horse={item} onClick={onHorseCardClick} />
            </div>
          ))
        )}
      </section>

      {hasNextPage && (
        <div ref={ref} className='flex w-full justify-center p-8'>
          <ClipLoader size={18} color='#3D4B63' />
        </div>
      )}

      <div className='text-body2 flex w-full justify-center gap-5'>
        <Button onClick={onClose} variant='secondary'>
          취소
        </Button>
        <Button onClick={onConfirm}>선택</Button>
      </div>
    </div>
  );
};

export default HorseSelectModalContent;
