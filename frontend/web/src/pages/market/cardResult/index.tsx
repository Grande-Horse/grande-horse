import FlipCard from '@/components/cards/FlipCard';
import { useEffect, useState } from 'react';
import { HorseCardType } from '@/types/card';
import { Button } from '@/components/ui/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import useInternalRouter from '@/hooks/useInternalRouter';

interface CardResultType {
  cardId: number;
  horseId: string;
  status: number;
  coatColor: string;
  name: string;
  horseRank: string;
  weight: number;
  speed: number;
  acceleration: number;
  stamina: number;
}

const CardResultPage: React.FC = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [data, setData] = useState<CardResultType[]>([]);
  const navigate = useNavigate();
  const { goBack } = useInternalRouter();
  const { state } = useLocation();

  useEffect(() => {
    setData(state.state.data);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.h-body');
    if (!container || flippedIndex === null) return;

    const cardWidth = 34.2;

    container.scroll({
      left: cardWidth * flippedIndex,
      behavior: 'smooth',
    });
  }, [flippedIndex]);

  return (
    <div className='h-body relative w-full overflow-x-scroll scroll-smooth'>
      <div
        className='absolute inset-0 h-full w-full scroll-smooth bg-contain bg-center bg-no-repeat'
        style={{
          overflowY: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
        }}
      />

      {data.map((horse, index) => (
        <FlipCard
          key={horse.cardId}
          horse={horse}
          index={index}
          isFlipped={flippedIndex === index}
          onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
        />
      ))}
      <div className='fixed top-14 flex translate-1/2 justify-center gap-4'>
        <Button
          onClick={() => {
            navigate('/market#2');
          }}
        >
          마시장으로 돌아가기
        </Button>
        <Button
          onClick={() => {
            navigate('/stall');
          }}
        >
          말 관리
        </Button>
      </div>
    </div>
  );
};

export default CardResultPage;
