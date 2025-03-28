import { type RankType } from '@/types/horse';
import { rankTextColor } from '@/constants/rank';
import Horse from '@/components/racetrack/Horse';

type CoatColorType = 'black' | 'lightbrown' | 'brown' | 'darkbrown' | 'gray';
// api 연동전에 임시 타입
interface UserCardProps {
  user: {
    id: number;
    userName: string;
    isReady: boolean;
    coatColor: CoatColorType;
    rank: RankType;
  };
}

const bgImageClass = {
  normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
  rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
  epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
  unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
  legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
} as const;

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div
      className={`${bgImageClass[user.rank]} ${rankTextColor[user.rank]} text-stroke flex flex-col items-center justify-between rounded-2xl bg-cover bg-center px-4 py-6`}
    >
      <p className='text-heading4 flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
        {user.userName}
      </p>
      <Horse color={user.coatColor} id={String(user.id)} />
      <p className={`text-body1 ${user.isReady ? '' : 'invisible'}`}>준비완료</p>
    </div>
  );
};

export default UserCard;
