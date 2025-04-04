import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';

import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';
import RoomList from '@/components/racetrack/RoomList';

import { type RoomData, type RoomCreateData } from '@/types/room';
import { roomCreateResetData, roomListResetData } from '@/constants/room';
import { useNavigate } from 'react-router-dom';
import RoomCreateModal, { RoomCreateModalReturn } from '@/components/racetrack/RoomCreateModal';
import { RankType } from '@/types/horse';

const { VITE_WEBSOCKET_URL } = import.meta.env;

const RacetrackPage = () => {
  const navigate = useNavigate();

  const [roomList, setRoomList] = useState<RoomData[]>(roomListResetData);
  const [newRoom, setNewRoom] = useState<RoomCreateData>(roomCreateResetData);

  const clientRef = useRef<Client | null>(null);
  const subscriptions = useRef<Map<string, StompSubscription>>(new Map());

  // 특정 구독 해제 함수
  const unsubscribe = (subId: string) => {
    const sub = subscriptions.current.get(subId);
    if (sub) {
      clientRef.current?.unsubscribe(sub.id);
      subscriptions.current.delete(subId);
    }
  };

  // 모든 구독 해제 함수
  const unsubscribeAll = () => {
    subscriptions.current.forEach((sub) => {
      clientRef.current?.unsubscribe(sub.id);
    });
    subscriptions.current.clear();
  };

  const handleCreateRoom = (roomData: RoomCreateData) => {
    if (!clientRef.current) {
      console.warn('WebSocket client is not connected.');
      return;
    }

    const sub1 = clientRef.current.subscribe('/user/queue/subscribe', (message) => {
      const id = JSON.parse(message.body);

      const sub2 = clientRef.current?.subscribe(`/topic/race_room/${id}/chat`, () => {});
      const sub3 = clientRef.current?.subscribe(`/topic/race_room/${id}`, () => {});

      if (sub2) subscriptions.current.set(`/topic/race_room/${id}/chat`, sub2);
      if (sub3) subscriptions.current.set(`/topic/race_room/${id}`, sub3);

      clientRef.current?.publish({ destination: `/app/race_room/${id}/join` });

      unsubscribe('/user/queue/subscribe');

      navigate(`/racetrack/room/${id}`);
    });

    if (sub1) subscriptions.current.set('/user/queue/subscribe', sub1);

    clientRef.current.publish({
      destination: '/app/createRoom',
      body: JSON.stringify(roomData),
    });
  };

  const handleClick = () => {
    const handleClose = () => {
      setNewRoom(roomCreateResetData);
    };
  };

  const { ModalWrapper, openModal, closeModal } = useModal<RoomCreateModalReturn>();
  const handleOpenModal = async () => {
    const value = await openModal();
    if (value) {
      const payload = {
        roomName: value.roomName,
        maxPlayers: value.maxPlayers,
        rankRestriction: value.rankRestriction as RankType,
        bettingCoin: value.bettingCoin,
      };

      handleCreateRoom(payload);
    }
  };

  useEffect(() => {
    if (clientRef.current) return;

    const socket = new SockJS(VITE_WEBSOCKET_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        clientRef.current = client;

        const sub = client.subscribe('/topic/waiting_rooms', (message) => {
          const data = JSON.parse(message.body);
          console.log('대기방 목록 업데이트:', data.raceRooms);
          setRoomList(data.raceRooms);
        });

        subscriptions.current.set('/topic/waiting_rooms', sub);
      },
      onStompError: (frame) => {
        console.error('STOMP 오류 발생:', frame);
      },
    });

    client.activate();

    return () => {
      if (clientRef.current) {
        console.log('WebSocket 연결 해제');
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      unsubscribeAll();
    };
  }, []);

  return (
    <div className='h-body relative flex flex-col gap-5 p-5'>
      <ModalWrapper>
        <RoomCreateModal close={closeModal} />
      </ModalWrapper>
      <div className='bg-background flex h-16 w-full justify-end'>
        <Button onClick={handleOpenModal}>
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
