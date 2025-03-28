import UserCard from '@/components/racetrack/UserCard';
import UserWaitingCard from '@/components/racetrack/UserWaitingCard';
import UserRestrictedCard from '@/components/racetrack/UserRestrictedCard';

import { userMockData } from '@/mocks/datas/user';

const MAX_PLAYER_COUNT = 6;
const USER_SETTING_COUNT = 5;

const RoomCardList: React.FC = () => {
  return (
    <div className='grid w-full grid-cols-3 gap-5'>
      {userMockData.map((user, idx) => (
        <UserCard user={user} key={idx} />
      ))}
      {Array.from({ length: USER_SETTING_COUNT - userMockData.length }).map((_, idx) => (
        <UserWaitingCard key={`waiting ${idx}`} />
      ))}
      {Array.from({ length: MAX_PLAYER_COUNT - USER_SETTING_COUNT }).map((_, idx) => (
        <UserRestrictedCard key={`restricted ${idx}`} />
      ))}
    </div>
  );
};

export default RoomCardList;
