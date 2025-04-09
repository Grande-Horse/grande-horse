import { useEffect, useState } from 'react';
import { useNavigate, useNavigationType } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';
import RoomList from '@/components/racetrack/RoomList';
import { RoomCreateModal, type RoomCreateModalReturn } from '@/components/racetrack/RoomCreateModal';

import { useStompClient } from '@/contexts/StompContext';
import { type RoomData, type RoomCreateData } from '@/types/room';
import { RankType } from '@/types/horse';

const RacetrackPage = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const { connected, publish, subscribe, unsubscribe } = useStompClient();

  const [roomList, setRoomList] = useState<RoomData[]>([]);

  const handleCreateRoom = (roomData: RoomCreateData) => {
    if (!connected) {
      console.warn('STOMP 연결되지 않음. 방 생성 실패');
      return;
    }

    subscribe(
      '/user/queue/subscribe',
      (roomId: string) => {
        navigate(`/racetrack/room/${roomId}?title=${roomData.roomName}`, {
          state: { roomId, maxPlayers: roomData.maxPlayers },
        });
      },
      (error) => {
        console.log(error);
      }
    );

    publish('/app/createRoom', roomData);
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
    subscribe('/topic/waiting_rooms', (data: { raceRooms: RoomData[] }) => {
      setRoomList(data.raceRooms);
    });
    publish('/app/waiting_rooms');

    if (navigationType === 'POP') {
      publish('/app/force_leave');
    }

    return () => {
      unsubscribe('/topic/waiting_rooms');
    };
  }, [connected]);

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
