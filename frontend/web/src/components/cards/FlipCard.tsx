import { HorseType } from '@/types/horse';
import HorseCard from './HorseCard';

const FlipCard = ({
  horse,
  index,
  isFlipped,
  onClick,
}: {
  horse: HorseType;
  index: number;
  isFlipped: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`aspect-[320/492] w-[34.2rem] cursor-pointer transition-all duration-500 transform-3d ${isFlipped ? 'z-50' : 'z-10'}`}
      style={{
        position: isFlipped ? 'fixed' : 'absolute',
        top: isFlipped ? '50%' : '85%',
        left: isFlipped ? '50%' : `${index * 10}rem`,
        transform: isFlipped ? 'translate(-50%, -70%) scale(0.9) rotateY(180deg)' : 'translate(-35%, -50%) scale(0.3)',
        zIndex: isFlipped ? 50 : 10,
      }}
    >
      {/* 뒷면 */}
      <div className='absolute inset-0 w-full bg-[url(@/assets/images/cardface-back.png)] bg-contain bg-center bg-no-repeat backface-hidden' />
      {/* 앞면 */}
      <div className='absolute inset-0 rotate-y-180 backface-hidden'>
        <HorseCard horse={horse} />
      </div>
    </div>
  );
};

export default FlipCard;
