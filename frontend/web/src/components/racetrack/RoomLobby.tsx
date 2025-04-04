import RoomCardList from '@/components/racetrack/RoomCardList';
import RoomActionButtons from '@/components/racetrack/RoomActionButtons';
import { type RoomJoinUserData } from '@/types/room';

interface RoomLobbyProps {
  children: React.ReactNode;
  users: RoomJoinUserData[];
  maxPlayers: number;
}

const RoomLobby: React.FC<RoomLobbyProps> = ({ children, users, maxPlayers }) => {
  return (
    <>
      <RoomCardList users={users} maxPlayers={maxPlayers} />
      {children}
      <RoomActionButtons />
    </>
  );
};

export default RoomLobby;
