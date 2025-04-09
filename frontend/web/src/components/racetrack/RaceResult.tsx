import { type ResultData } from '@/types/race';
import { Button } from '../ui/Button';
import useModal from '../ui/modal/useModal';

interface RaceResultProps {
  gameResult: ResultData['gameResult'];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const prizeTextColor: Record<number, string> = {
  1: 'text-unique',
  2: 'text-legend',
  3: 'text-rare',
} as const;

const RaceResult: React.FC<RaceResultProps> = ({ gameResult, setIsOpen }) => {
  const handleOnClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <section className='absolute flex min-w-[350px] flex-col items-center justify-center gap-6 rounded-sm bg-black/70 p-8'>
      <p className='text-heading1 text-stroke'>순위 결과</p>
      <div className='flex w-full truncate px-6'>
        <p className='flex-1 text-center'>등수</p>
        <p className='flex-2 text-center'>유저</p>
        <p className='flex-2 text-center'>획득 코인</p>
      </div>

      {gameResult.map(({ raceRank, totalPrize, userNickname }) => (
        <div
          key={raceRank}
          className={`${prizeTextColor[raceRank]} text-stroke text-body1 flex w-full items-center justify-between truncate bg-white/50 px-6 py-2`}
        >
          <p className='text-heading1 flex-1 text-center'>{raceRank}</p>
          <p className='flex-2 text-center'>{userNickname}</p>
          <p className='flex-2 text-center'>{totalPrize}</p>
        </div>
      ))}

      <div className='z-50 flex'>
        <Button className='bg-primary/50 text-body1 w-full rounded-sm text-white' onClick={handleOnClick}>
          방으로 돌아가기
        </Button>
      </div>
    </section>
  );
};

export default RaceResult;
