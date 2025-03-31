import SmallHorseCard from '@/components/cards/SmallHorseCard';
import { queryKey } from '@/constants/queryKey';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { getMyHorseTrading } from '@/services/trading';
import { HorseType } from '@/types/horse';
import { ClipLoader } from 'react-spinners';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';

interface HorseSelectModalContentProps {
  selectedHorse: HorseType | null;
  onHorseCardClick: (horse: HorseType | null) => void;
}

const HorseSelectModalContent: React.FC<HorseSelectModalContentProps> = ({ selectedHorse, onHorseCardClick }) => {
  // TODO: 추후 내 말 전체 목록 조회 API로 변경
  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_TRADING, getMyHorseTrading);

  return (
    <div className='max-h-[36rem] overflow-y-auto'>
      <section className='grid grid-cols-2 place-items-center gap-y-5'>
        {data?.pages.flatMap((page) =>
          page.items.map((item) => (
            <div className='relative'>
              {selectedHorse?.id === item.id && (
                <div
                  key={item.id}
                  onClick={() => onHorseCardClick(null)}
                  className='absolute top-1 z-10 flex h-66 w-44 cursor-pointer items-center justify-center rounded-sm bg-black/20'
                >
                  <SelectedIcon />
                </div>
              )}
              <SmallHorseCard key={item.id} horse={item} onHorseCardClick={() => onHorseCardClick(item)} />
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
