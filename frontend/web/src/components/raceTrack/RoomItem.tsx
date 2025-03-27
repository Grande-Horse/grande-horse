import { Link } from 'react-router-dom';
import HeadCountIcon from '@/assets/icons/headCountIcon.svg?react';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import { rankTextColor, rankMap } from '@/constants/rank';
import { type RoomData } from '@/types/room';

interface RoomItemProps {
  room: RoomData;
}

const RoomItem: React.FC<RoomItemProps> = ({ room }) => {
  return (
    <Link
      to={`./room/${room.id}?title=${room.title}`}
      className='flex items-center justify-between gap-5 rounded-xl bg-white/10 p-9 inset-shadow-xs inset-shadow-white/30 hover:bg-white/20 active:bg-white/30'
    >
      <p className='flex-1 truncate'>{room.title}</p>
      <div className='text-stroke flex items-center gap-3'>
        <p className={`${rankTextColor[room.rank === '' ? 'normal' : room.rank]}`}>
          {rankMap[room.rank === '' ? 'normal' : room.rank]} ↓
        </p>
        <div className='flex items-center gap-2'>
          <CoinIcon className='size-6' />
          <p className='flex w-12 justify-end'>{room.batting}</p>
        </div>
        <div className='flex items-center gap-2'>
          <HeadCountIcon className='size-6' />
          <p>
            {room.players}/{room.maxPlayers}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RoomItem;
