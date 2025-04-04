import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';
import RoomList from '@/components/racetrack/RoomList';
import RoomCreateModal, { RoomCreateModalReturn } from '@/components/racetrack/RoomCreateModal';

import { useStompClient } from '@/context/StompContext';
import { type RoomData, type RoomCreateData } from '@/types/room';
import { RankType } from '@/types/horse';

const RacetrackPage = () => {
  const navigate = useNavigate();

  const { connected, publish, subscribe, unsubscribe } = useStompClient();

  const [roomList, setRoomList] = useState<RoomData[]>([]);

  const handleCreateRoom = (roomData: RoomCreateData) => {
    if (!connected) {
      console.warn('STOMP 연결되지 않음. 방 생성 실패');
      return;
    }

    subscribe('/user/queue/subscribe', (roomId: string) => {
      unsubscribe('/user/queue/subscribe');
      navigate(`/racetrack/room/${roomId}?title=${roomData.roomName}`, {
        state: { roomId, maxPlayers: roomData.maxPlayers },
      });
    });

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
    //이미 구독 중인 경우 처리 추가예정
    subscribe('/topic/waiting_rooms', (data: { raceRooms: RoomData[] }) => {
      console.log('대기실 목록 수신', data.raceRooms);
      setRoomList(data.raceRooms);
    });
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
