import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';
import RoomList from '@/components/racetrack/RoomList';
import { RoomCreateModalContent, RoomCreateModalTitle } from '@/components/racetrack/RoomCreateModal';

import { type RoomData } from '@/types/room';
import { roomMockData } from '@/mocks/datas/room';

const { VITE_WEBSOCKET_URL } = import.meta.env;

const RacetrackPage = () => {
  const { openModal } = useModal();

  const [roomList, setRoomList] = useState<RoomData[]>([]);

  const [newRoom, setNewRoom] = useState<RoomData>({
    roomId: 0,
    roomName: '',
    rankRestriction: 'normal',
    bettingCoin: 0,
    currentPlayers: 0,
    maxPlayers: 6,
  });

  const handleConfirm = async (updatedRoom) => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRoom), // 새로운 방 데이터를 JSON으로 전송
      });

      if (!response.ok) {
        throw new Error('방 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('방 생성 성공:', data);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleClick = () => {
    openModal({
      title: <RoomCreateModalTitle />,
      confirmText: '생성',
      content: <RoomCreateModalContent newRoom={newRoom} setNewRoom={setNewRoom} />,
      onConfirm: () => {
        // if (clientRef.current) {
        //   clientRef.current.publish({ destination: '/app/createRoom', body: JSON.stringify(newRoom) });
        //   clientRef.current.subscribe('/queue/subscribe', () => {
        //     // 방장
        //     console.log('zz');

        //     // roomid 받기
        //   });
        // }

        // setNewRoom((prevNewRoom) => {
        //   const updatedRoom = { ...prevNewRoom };
        //   handleConfirm(updatedRoom);
        //   return updatedRoom;
        // });
        setNewRoom({
          roomId: 0,
          roomName: '',
          rankRestriction: '',
          bettingCoin: 0,
          currentPlayers: 0,
          maxPlayers: 6,
        });
      },
      onCancel: () => {
        setNewRoom({
          roomId: 0,
          roomName: '',
          rankRestriction: '',
          bettingCoin: 0,
          currentPlayers: 0,
          maxPlayers: 6,
        });
      },
    });
  };

  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (clientRef.current) return;
    const socket = new SockJS(VITE_WEBSOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('연결');
        // 연결과 동시에 구독하기 (대기방 목록 보여주기)
        client.subscribe('/topic/waiting_rooms', (message) => {
          // const data = JSON.parse(message.body).rooms;
          setRoomList(roomMockData);
        });
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, []);

  return (
    <div className='h-body relative flex flex-col gap-5 p-5'>
      <div className='bg-background flex h-16 w-full justify-end'>
        <Button onClick={handleClick}>
          <p className='px-10'>방 생성</p>
        </Button>
      </div>
      <div className='flex-1 overflow-auto'>
        <RoomList rooms={roomList} />
      </div>
    </div>
  );
};

export default RacetrackPage;
