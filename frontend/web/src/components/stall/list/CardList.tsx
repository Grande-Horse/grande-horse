import SmallHorseCard from '@/components/cards/SmallHorseCard';
import useGetMyHorseCards from '@/hooks/useQueries/useGetMyHorseCards';
import { HorseCardType } from '@/types/card';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ClipLoader } from 'react-spinners';

interface CardListProps {
  rank: string;
  onClick: (horse: HorseCardType) => void;
  type?: 'default' | 'combine';
}

const CardList: React.FC<CardListProps> = ({ rank, onClick, type = 'default' }) => {
  const { data, fetchNextPage, hasNextPage } = useGetMyHorseCards(rank);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <section className='grid grid-cols-3 place-items-center px-1 py-2'>
        {data.pages.flatMap((page) =>
          page.items
            .filter((item) => type !== 'combine' || item.status === 0)
            .map((item) => <SmallHorseCard key={item.cardId} horse={item} onClick={onClick} />)
        )}
      </section>
      {hasNextPage && (
        <div ref={ref} className='flex w-full justify-center p-8'>
          <ClipLoader size={18} color='#3D4B63' />
        </div>
      )}
    </>
  );
};

export default CardList;
