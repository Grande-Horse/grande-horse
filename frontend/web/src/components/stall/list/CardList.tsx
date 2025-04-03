import SmallHorseCard from '@/components/cards/SmallHorseCard';
import { queryKey } from '@/constants/queryKey';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { getMyHorseCards } from '@/services/stall';
import { HorseCardType } from '@/types/card';
import { ClipLoader } from 'react-spinners';

interface CardListProps {
  rank: string;
  onClick: (horse: HorseCardType) => void;
}

const CardList: React.FC<CardListProps> = ({ rank, onClick }) => {
  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_HORSE_CARDS, getMyHorseCards, rank);

  return (
    <>
      <section className='grid grid-cols-3 place-items-center px-1 py-2'>
        {data.pages.flatMap((page) =>
          page.items.map((item) => <SmallHorseCard key={item.tradeId} horse={item} onClick={onClick} />)
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
