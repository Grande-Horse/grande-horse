import Horse from '@/components/racetrack/Horse';
import CrownIcon from '@/assets/icons/crownIcon.svg?react';
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
      className={`${bgImageClass[user.horseRank]} ${rankTextColor[user.horseRank]} text-stroke relative flex flex-col items-center justify-between rounded-2xl bg-cover bg-center px-4 py-6`}
    >
      {user.roomOwner && (
        <div className='absolute top-0 left-0'>
          <CrownIcon />
        </div>
      )}

      <p className='text-body2 flex w-full items-center justify-center rounded-xl py-2 shadow-inner shadow-black/20'>
        {user.userNickname}
      </p>
      <Horse color={user.horseColor} direction='right' state='idle' />
      <p className={`text-body1 ${user.ready ? '' : 'invisible'}`}>준비완료</p>
    </div>
  );
};

export default UserCard;
