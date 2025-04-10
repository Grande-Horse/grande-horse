import { type ResultData } from '@/types/race';
import { Button } from '@/components/ui/Button';

import { rankTextColor } from '@/constants/rank';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

interface RaceResultProps {
  gameResult: ResultData['gameResult'];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  playersInfo: ResultData['playersInfo'];
}

const RaceResult: React.FC<RaceResultProps> = ({ gameResult, setIsOpen, playersInfo }) => {
  const { refetch } = useUserInfo();
  const handleOnClick = () => {
    refetch();
    setIsOpen(false);
  };

  return (
    <section className='absolute flex min-w-[350px] flex-col items-center justify-center gap-6 rounded-sm bg-black/70 p-8'>
      <p className='text-heading1 text-stroke'>순위 결과</p>
      <div className='flex w-full truncate px-6'>
        <p className='flex-1 text-center'>등수</p>
        <p className='flex-2 text-center'>유저</p>
        <p className='flex-2 text-center'>획득 코인</p>
      </div>

      {gameResult.map(({ raceRank, totalPrize, userNickname, userId }) => {
        const player = playersInfo?.find((p) => p.userId === userId);
        const textColor = player?.horseRank ? rankTextColor[player.horseRank] : 'text-white';
        return (
          <div
            key={raceRank}
            className={`${textColor} text-stroke text-body1 flex w-full items-center justify-between truncate bg-white/50 px-6 py-2`}
          >
            <p className='text-heading1 flex-1 text-center'>{raceRank}</p>
            <p className='flex-2 text-center'>{userNickname}</p>
            <p className='flex-2 text-center'>{totalPrize}</p>
          </div>
        );
      })}

      <div className='z-9999 flex'>
        <Button className='bg-primary/50 text-body1 w-full rounded-sm text-white' onClick={handleOnClick}>
          방으로 돌아가기
        </Button>
      </div>
    </section>
  );
};

export default RaceResult;
