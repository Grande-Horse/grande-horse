import Horse from '@/components/racetrack/Horse';
import { rankTextColor } from '@/constants/rank';

const RoomCard: React.FC = () => {
  interface Horse {
    id: number;
    name: string;
    rank: 'normal' | 'rare' | 'epic' | 'unique' | 'legend';
    color: 'black' | 'brown' | 'gray' | 'lightbrown' | 'darkbrown';
  }

  const horses: Horse[] = [
    {
      id: 1,
      name: '굿필승',
      rank: 'normal',
      color: 'black',
    },
    {
      id: 2,
      name: '굿필승',
      rank: 'rare',
      color: 'brown',
    },
    {
      id: 3,
      name: '굿필승',
      rank: 'epic',
      color: 'gray',
    },
    {
      id: 4,
      name: '굿필승',
      rank: 'unique',
      color: 'lightbrown',
    },
    {
      id: 5,
      name: '굿필승',
      rank: 'legend',
      color: 'darkbrown',
    },
    {
      id: 6,
      name: '굿필승',
      rank: 'rare',
      color: 'brown',
    },
  ];

  const bgImageClass = {
    normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
    rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
    epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
    unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
    legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
  } as const;

  return (
    <div className='grid w-full grid-cols-3 gap-5'>
      {horses.map((horse) => {
        return (
          <div
            key={horse.id}
            className={`${bgImageClass[horse.rank]} ${rankTextColor[horse.rank]} text-stroke flex flex-col items-center justify-between rounded-2xl bg-cover bg-center px-4 py-6`}
          >
            <p className='text-heading4 flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
              {horse.name}
            </p>
            <Horse color={horse.color} id={String(horse.id)} />
            <p className='text-body1'>준비완료</p>
          </div>
        );
      })}
    </div>
  );
};

export default RoomCard;
