import Horse from '@/components/racetrack/Horse';
import { rankTextColor } from '@/constants/rank';
import { type RoomJoinUserData } from '@/types/room';

interface UserCardProps {
  user: RoomJoinUserData;
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
      className={`${bgImageClass[user.horseRank]} ${rankTextColor[user.horseRank]} text-stroke flex flex-col items-center justify-between rounded-2xl bg-cover bg-center px-4 py-6`}
    >
      <p className='text-heading4 flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
        {user.userNickname}
      </p>
      <Horse color={user.horseColor} direction='down' state='idle' />
      <p className={`text-body1 ${user.ready ? '' : 'invisible'}`}>준비완료</p>
    </div>
  );
};

export default UserCard;
