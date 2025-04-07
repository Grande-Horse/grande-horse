import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStompClient } from '@/contexts/StompContext';
import ChatBox from '@/components/racetrack/ChatBox';
import RoomLobby from '@/components/racetrack/RoomLobby';
import { type RoomJoinUserData } from '@/types/room';

interface Chat {
  sender: string;
  message: string;
  time: string;
}

const RacetrackRoomPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { connected, publish, subscribe, unsubscribe } = useStompClient();
  const [users, setUsers] = useState<RoomJoinUserData[]>([]);
  const [maxPlayers, setMaxPlayers] = useState<number>(6);
  const [roomId, setRoomId] = useState<number>(0);

  const [chatContent, setChatContent] = useState<Chat[]>([]);

  useEffect(() => {
    if (!state) {
      navigate('/racetrack', { replace: true });
      return;
    }
    const roomId = state.roomId;
    const maxPlayers = state.maxPlayers;

    setMaxPlayers(maxPlayers);
    setRoomId(roomId);

    const chatPath = `/topic/race_room/${roomId}/chat`;
    const usersPath = `/topic/race_room/${roomId}`;

    subscribe(chatPath, (data: Chat) => {
      if (data.sender === 'SYSTEM' && data.message === '[알림] 경주가 시작됩니다!') {
        navigate(`/racetrack/room/${roomId}/race`, { state: { roomId }, replace: true });
      }
      setChatContent((prev) => {
        return [...prev, data];
      });
    });
    subscribe(usersPath, (data: RoomJoinUserData[]) => {
      setUsers(data);
    });

    publish(`/app/race_room/${roomId}/join`);

    return () => {
      unsubscribe(chatPath);
      unsubscribe(usersPath);
    };
  }, [connected]);

  return (
    <div className='flex h-[calc(100dvh-6rem)] flex-col gap-5 p-5'>
      <RoomLobby roomId={roomId} users={users} maxPlayers={maxPlayers}>
        <ChatBox roomId={roomId} chatContent={chatContent} />
      </RoomLobby>
    </div>
  );
};

export default RacetrackRoomPage;
