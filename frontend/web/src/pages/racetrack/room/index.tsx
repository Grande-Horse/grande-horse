import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStompClient } from '@/contexts/StompContext';
import ChatBox from '@/components/racetrack/ChatBox';
import RoomLobby from '@/components/racetrack/RoomLobby';
import { type RoomJoinUserData } from '@/types/room';
import { type RankType } from '@/types/horse';

interface Chat {
  sender: string;
  message: string;
  time: string;
}

interface RaceData {
  rankRestriction: RankType;
  isGameStarted: boolean;
  playersInfo: RoomJoinUserData[];
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

    subscribe(
      chatPath,
      (data: Chat) => {
        setChatContent((prev) => {
          return [...prev, data];
        });
      },
      (error) => {
        // console.log(error);
      }
    );
    subscribe(
      usersPath,
      (data: RaceData) => {
        if (data.isGameStarted) {
          navigate(`/racetrack/room/${roomId}/race`, { state: { roomId, playsers: data.playersInfo }, replace: true });
        }
        setUsers(data.playersInfo);
      },
      (error) => {
        // console.log(error);
      }
    );

    if (state.isEnd) {
      setUsers(state.playersInfo);
      setMaxPlayers(state.maxPlayers);
    } else {
      publish(`/app/race_room/${roomId}/join`);
    }

    return () => {
      unsubscribe(chatPath);
      unsubscribe(usersPath);
    };
  }, [connected]);

  return (
    <div className='flex h-[calc(100dvh-6rem)] flex-col gap-5 p-5'>
      <RoomLobby roomId={roomId} users={users} maxPlayers={maxPlayers}>
        <ChatBox roomId={roomId} chatContent={chatContent} users={users} />
      </RoomLobby>
    </div>
  );
};

export default RacetrackRoomPage;
