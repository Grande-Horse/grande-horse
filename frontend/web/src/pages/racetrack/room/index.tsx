import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useStompClient } from '@/context/StompContext';
import ChatBox from '@/components/racetrack/ChatBox';
import RoomLobby from '@/components/racetrack/RoomLobby';
import { type RoomJoinUserData } from '@/types/room';

const RacetrackRoomPage = () => {
  const { state } = useLocation();
  const { connected, publish, subscribe, unsubscribe } = useStompClient();
  const [users, setUsers] = useState<RoomJoinUserData[]>([]);
  const [maxPlayers, setMaxPlayers] = useState<number>(6);

  useEffect(() => {
    if (!connected) {
      //재연결시도 (stomp)
    }
    if (!state) {
      console.error('Url로 바로 접근함');
      return;
    }
    const roomId = state.roomId;
    const maxPlayers = state.maxPlayers;

    subscribe(`/topic/race_room/${roomId}/chat`, () => {});
    subscribe(`/topic/race_room/${roomId}`, (data: RoomJoinUserData[]) => {
      setUsers(data);
      setMaxPlayers(maxPlayers);
    });

    publish(`/app/race_room/${roomId}/join`);
  }, []);

  return (
    <div className='flex h-[calc(100dvh-6rem)] flex-col gap-5 p-5'>
      <RoomLobby users={users} maxPlayers={maxPlayers}>
        <ChatBox />
      </RoomLobby>
    </div>
  );
};

export default RacetrackRoomPage;
