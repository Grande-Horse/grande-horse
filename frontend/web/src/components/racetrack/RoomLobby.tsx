import RoomCardList from '@/components/racetrack/RoomCardList';
import RoomActionButtons from './RoomActionButtons';

interface RoomLobbyProps {
  children: React.ReactNode;
}

const RoomLobby: React.FC<RoomLobbyProps> = ({ children }) => {
  return (
    <>
      <RoomCardList />
      {children}
      <RoomActionButtons />
    </>
  );
};

export default RoomLobby;
