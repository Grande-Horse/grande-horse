import { RoomData } from '@/types/room';
import RoomItem from './RoomItem';

interface RoomListProps {
  rooms: RoomData[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  return (
    <div className='text-detail flex flex-col gap-5 p-5'>
      {rooms.map((room, idx) => {
        return <RoomItem room={room} key={idx} />;
      })}
    </div>
  );
};

export default RoomList;
