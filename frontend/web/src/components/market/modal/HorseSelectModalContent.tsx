import SmallHorseCard from '@/components/cards/SmallHorseCard';
import { queryKey } from '@/constants/queryKey';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { ClipLoader } from 'react-spinners';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';
import { getMyHorseCards } from '@/services/stall';
import { HorseCardType } from '@/types/card';

interface HorseSelectModalContentProps {
  selectedHorse: HorseCardType | null;
  onHorseCardClick: (horse: HorseCardType | null) => void;
}

const HorseSelectModalContent: React.FC<HorseSelectModalContentProps> = ({ selectedHorse, onHorseCardClick }) => {
  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_HORSE_CARDS, getMyHorseCards, 'all');

  return (
    <div className='max-h-[36rem] overflow-y-auto'>
      <section className='grid grid-cols-2 place-items-center gap-y-5'>
        {data?.pages.flatMap((page) =>
          page.items.map((item) => (
            <div className='relative'>
              {selectedHorse?.horseId === item.id && (
                <div
                  key={item.id}
                  onClick={() => onHorseCardClick(null)}
                  className='absolute top-1 z-10 flex h-66 w-44 cursor-pointer items-center justify-center rounded-sm bg-black/20'
                >
                  <SelectedIcon />
                </div>
              )}
              <SmallHorseCard key={item.id} horse={item} onClick={onHorseCardClick} />
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
  );
};

export default HorseSelectModalContent;
