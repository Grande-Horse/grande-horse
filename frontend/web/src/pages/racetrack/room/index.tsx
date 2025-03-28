import ChatBox from '@/components/racetrack/ChatBox';
import RoomLobby from '@/components/racetrack/RoomLobby';

const RacetrackRoomPage = () => {
  return (
    <div className='flex h-[calc(100dvh-6rem)] flex-col gap-5 p-5'>
      <RoomLobby>
        <ChatBox />
      </RoomLobby>
    </div>
  );
};

export default RacetrackRoomPage;
