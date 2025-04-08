import { RaceResultType } from '@/types/race';

interface RaceResult {
  raceResult: RaceResultType[];
}

const prizeTextColor: Record<number, string> = {
  1: 'text-unique',
  2: 'text-legend',
  3: 'text-rare',
} as const;

const RaceResult: React.FC<RaceResult> = ({ raceResult }) => {
  return (
    <section className='absolute flex w-10/11 flex-col items-center justify-center gap-6 rounded-sm bg-black/70 p-8'>
      <p className='text-heading1 text-stroke'>순위 결과</p>
      <div className='flex w-full truncate px-6'>
        <p className='flex-1 text-center'>등수</p>
        <p className='flex-2 text-center'>유저</p>
        <p className='flex-2 text-center'>경주마</p>
        <p className='flex-2 text-center'>획득 코인</p>
        <p className='flex-1 text-center'>기록</p>
      </div>
      {raceResult.map(({ prize, userName, horseName, coin, time }) => (
        <div
          key={prize}
          className={`${prizeTextColor[prize]} text-stroke text-body1 flex w-full items-center justify-between truncate bg-white/50 px-6 py-2`}
        >
          <p className='text-heading1 flex-1 text-center'>{prize}</p>
          <p className='flex-2 text-center'>{userName}</p>
          <p className='flex-2 text-center'>{horseName}</p>
          <p className='flex-2 text-center'>+{coin}</p>
          <p className='flex-1 text-center'>{time}s</p>
        </div>
      ))}
    </section>
  );
};

export default RaceResult;
