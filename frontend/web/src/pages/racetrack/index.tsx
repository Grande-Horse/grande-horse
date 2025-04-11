import { useEffect, useState } from 'react';
import { useNavigate, useNavigationType } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import RoomList from '@/components/racetrack/RoomList';
import { RoomCreateModal } from '@/components/racetrack/RoomCreateModal';

import { useStompClient } from '@/contexts/StompContext';
import { type RoomData, type RoomCreateData } from '@/types/room';
import { customError } from '@/constants/error';

const RacetrackPage = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const { connected, publish, subscribe, unsubscribe } = useStompClient();

  const [roomList, setRoomList] = useState<RoomData[]>([]);

  const [isOpen, setIsOpen] = useState(false);

  const [roomData, setRoomData] = useState<RoomCreateData>();

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    subscribe('/topic/waiting_rooms', (data: { raceRooms: RoomData[] }) => {
      setRoomList(data.raceRooms);
    });

    if (navigationType === 'POP') {
      publish('/app/force_leave');
    }

    return () => {
      unsubscribe('/topic/waiting_rooms');
      publish('/app/force_leave');
    };
  }, [connected]);

  useEffect(() => {
    subscribe(
      '/user/queue/subscribe',
      (data: any) => {
        if (data.type === 'createRoom') {
          if (!roomData) {
            // console.warn('roomData가 설정되지 않았습니다.');
            return;
          }
          navigate(`/racetrack/room/${data.roomId}?title=${roomData.roomName}`, {
            state: { roomId: data.roomId, maxPlayers: roomData.maxPlayers },
            replace: true,
          });
        } else {
          setRoomList(data.initialRooms);
        }
      },
      (error: string) => {
        const allowedErrors = ['R1', 'R3', 'R6', 'R8', 'R9', 'R10', 'CA13'];
        if (allowedErrors.includes(error)) {
          alert(customError[error as keyof typeof customError].message);
        }
      }
    );

    return () => {
      unsubscribe('/user/queue/subscribe');
    };
  }, [roomData]);

  useEffect(() => {
    publish('/app/initial_waiting_rooms');
  }, []);

  return (
    <div className='h-body relative flex flex-col gap-5 p-5'>
      <div className={` ${isOpen ? 'bg-modal z-modal fixed inset-0 flex items-center justify-center' : 'hidden'}`}>
        <RoomCreateModal
          onSuccess={(data) => {
            setRoomData(data);
          }}
          setIsOpen={setIsOpen}
        />
      </div>
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
