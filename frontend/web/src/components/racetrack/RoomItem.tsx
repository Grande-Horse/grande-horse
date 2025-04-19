import { Link, useNavigate } from 'react-router-dom';
import HeadCountIcon from '@/assets/icons/headCountIcon.svg?react';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import { rankTextColor, rankMap } from '@/constants/rank';
import { type RoomData } from '@/types/room';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

interface RoomItemProps {
  room: RoomData;
}

const RankScore = {
  all: 6,
  legend: 5,
  unique: 4,
  epic: 3,
  rare: 2,
  normal: 1,
};

const RoomItem: React.FC<RoomItemProps> = ({ room }) => {
  const currentPlayers = room.currentPlayers || 1;
  const isRoomFull = currentPlayers >= room.maxPlayers;
  const isGameStarted = room.start;

  const { data } = useUserInfo();
  const navigate = useNavigate();

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (data) {
      if (data.coin < room.bettingCoin) {
        alert('코인이 부족합니다.');
        return;
      }

      if (data.representativeCard === null) {
        alert('대표 카드가 설정되지 않았습니다. 설정 후 다시 시도해주세요.');
        return;
      }

      if (RankScore[data.representativeCard.horseRank] > RankScore[room.rankRestriction as keyof typeof RankScore]) {
        alert(`제한 등급보다 높은 카드로 입장할 수 없습니다.`);
        return;
      }

      navigate(`/racetrack/room/${room.roomId}?title=${room.roomName}`, {
        state: {
          roomId: room.roomId,
          maxPlayers: room.maxPlayers,
        },
      });
    }
  };

  const Container = ({ children }: { children: React.ReactNode }) =>
    isRoomFull || isGameStarted ? (
      <div
        className='flex cursor-not-allowed items-center justify-between gap-5 rounded-xl bg-gray-400/30 p-9 text-gray-400 inset-shadow-xs'
        aria-disabled
      >
        {children}
      </div>
    ) : (
      <Link
        to={`./room/${room.roomId}?title=${room.roomName}`}
        state={{ roomId: room.roomId, maxPlayers: room.maxPlayers }}
        onClick={handleOnClick}
        className='flex items-center justify-between gap-5 rounded-xl bg-white/10 p-9 inset-shadow-xs inset-shadow-white/30 hover:bg-white/20 active:bg-white/30'
      >
        {children}
      </Link>
    );

  return (
    <Container>
      <p className='flex-1 truncate'>{room.roomName}</p>
      <div className='text-stroke flex items-center gap-3'>
        <p className={`${rankTextColor[room.rankRestriction === '' ? 'normal' : room.rankRestriction]}`}>
          {rankMap[room.rankRestriction === '' ? 'normal' : room.rankRestriction]} ↓
        </p>
        <div className='flex items-center gap-2'>
          <CoinIcon className='size-6' />
          <p className='flex w-12 justify-end'>{room.bettingCoin}</p>
        </div>
        <div className='flex items-center gap-2'>
          <HeadCountIcon className='size-6' />
          <p>
            {room.currentPlayers}/{room.maxPlayers}
          </p>
        </div>
        {isGameStarted && <div className='ml-1 text-sm text-red-400'>(게임중)</div>}
      </div>
    </Container>
  );
};

export default RoomItem;
