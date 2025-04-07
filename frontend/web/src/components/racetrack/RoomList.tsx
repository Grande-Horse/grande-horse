import { type RoomData } from '@/types/room';
import RoomItem from '@/components/racetrack/RoomItem';

interface RoomListProps {
  rooms: RoomData[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  return (
    <div className='text-detail flex h-full flex-col gap-5'>
      {rooms.length > 0 ? (
        rooms.map((room) => {
          return <RoomItem room={room} key={room.roomId} />;
        })
      ) : (
        <div className='text-stroke flex h-full w-full items-center justify-center'>생성된 방이 없습니다.</div>
      )}
    </div>
  );
};

export default RoomList;
