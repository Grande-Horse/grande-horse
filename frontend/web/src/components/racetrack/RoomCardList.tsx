import UserCard from '@/components/racetrack/UserCard';
import UserWaitingCard from '@/components/racetrack/UserWaitingCard';
import UserRestrictedCard from '@/components/racetrack/UserRestrictedCard';

import { type RoomJoinUserData } from '@/types/room';

interface RoomCardListProps {
  users: RoomJoinUserData[];
  maxPlayers: number;
}

const MAX_PLAYER_COUNT = 6;

const RoomCardList: React.FC<RoomCardListProps> = ({ users, maxPlayers }) => {
  return (
    <div className='grid w-full grid-cols-3 grid-rows-2 gap-5'>
      {users.map((user, idx) => (
        <UserCard user={user} key={idx} />
      ))}
      {Array.from({ length: maxPlayers - users.length }).map((_, idx) => (
        <UserWaitingCard key={`waiting ${idx}`} />
      ))}
      {Array.from({ length: MAX_PLAYER_COUNT - maxPlayers }).map((_, idx) => (
        <UserRestrictedCard key={`restricted ${idx}`} />
      ))}
    </div>
  );
};

export default RoomCardList;
