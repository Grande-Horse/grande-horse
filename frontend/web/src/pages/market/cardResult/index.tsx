import FlipCard from '@/components/cards/FlipCard';
import { useEffect, useState } from 'react';
import { HorseCardType } from '@/types/card';

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

  useEffect(() => {
    const container = document.querySelector('.h-body');
    if (!container || flippedIndex === null) return;

    const cardWidth = 34.2;

    container.scroll({
      left: cardWidth * flippedIndex,
      behavior: 'smooth',
    });
  }, [flippedIndex]);

  const data: HorseCardType[] = [
    {
      cardId: 0,
      horseId: 'STRING',
      status: 1,
      coatColor: 'black',
      name: 'STRING',
      horseRank: 'rare',
      weight: 1,
      speed: 1,
      acceleration: 1,
      stamina: 1,
    },
    {
      cardId: 1,
      horseId: 'STRING',
      status: 1,
      coatColor: 'black',
      name: 'STRING',
      horseRank: 'rare',
      weight: 1,
      speed: 1,
      acceleration: 1,
      stamina: 1,
    },
    {
      cardId: 2,
      horseId: 'STRING',
      status: 1,
      coatColor: 'black',
      name: 'STRING',
      horseRank: 'normal',
      weight: 1,
      speed: 1,
      acceleration: 1,
      stamina: 1,
    },
    {
      cardId: 3,
      horseId: 'STRING',
      status: 1,
      coatColor: 'black',
      name: 'STRING',
      horseRank: 'normal',
      weight: 1,
      speed: 1,
      acceleration: 1,
      stamina: 1,
    },
    {
      cardId: 4,
      horseId: 'STRING',
      status: 1,
      coatColor: 'black',
      name: 'STRING',
      horseRank: 'epic',
      weight: 1,
      speed: 1,
      acceleration: 1,
      stamina: 1,
    },
    {
      cardId: 5,
      horseId: 'STRING',
      status: 1,
      coatColor: 'black',
      name: 'STRING',
      horseRank: 'rare',
      weight: 1,
      speed: 1,
      acceleration: 1,
      stamina: 1,
    },
  ];

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
    </div>
  );
};

export default CardResultPage;
