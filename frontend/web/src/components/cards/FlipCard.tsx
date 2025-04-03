import { HorseType } from '@/types/horse';
import HorseCard from './HorseCard';
import { useState } from 'react';

const FlipCard = ({ horse }: { horse: HorseType }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardBackImageUrl = `bg-[url(@/assets/images/cardface-back.png)]`;

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className={`relative aspect-[320/492] w-[34.2rem] cursor-pointer perspective-distant ${isFlipped ? '[&_.card-face.back]:-rotate-y-180 [&_.card-face.front]:rotate-y-0' : ''}`}
      onClick={handleClick}
    >
      <div className='card-face front absolute top-0 left-0 z-2 rotate-y-180 transition-transform duration-400 ease-out backface-hidden transform-3d'>
        <HorseCard key={horse.id} horse={horse} />
      </div>
      <div
        className={`card-face back ${cardBackImageUrl} absolute top-0 left-0 h-full w-full rotate-y-0 bg-contain bg-center bg-no-repeat transition-transform duration-400 ease-out backface-hidden transform-3d`}
      />
    </div>
  );
};

export default FlipCard;
