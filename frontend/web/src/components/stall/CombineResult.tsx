import HorseCard from '@/components/cards/HorseCard';
import useClickOutsideRef from '@/hooks/useClickOutsideRef';
import { HorseCardType } from '@/types/card';

interface CombineResult {
  horseCard: HorseCardType;
  onClick: () => void;
}

const CombineResult: React.FC<CombineResult> = ({ horseCard, onClick }) => {
  const ref = useClickOutsideRef<HTMLDivElement>(onClick);

  return (
    <div className='bg-modal fixed top-0 left-0 z-1000 flex h-screen w-full flex-col items-center justify-center'>
      <div ref={ref} className='transition-all duration-100'>
        <HorseCard horse={horseCard} />
      </div>
      <p>카드 영역 바깥을 클릭해 주세요.</p>
    </div>
  );
};

export default CombineResult;
