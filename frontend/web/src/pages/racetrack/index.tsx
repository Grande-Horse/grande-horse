import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';
import RoomList from '@/components/racetrack/RoomList';
import { RoomCreateModalContent, RoomCreateModalTitle } from '@/components/racetrack/RoomCreateModal';

import { RoomData } from '@/types/room';
import { roomMockData } from '@/mocks/datas/room';
import { useEffect, useState } from 'react';

const RacetrackPage = () => {
  const { openModal } = useModal();

  // useQuery으로 변경예정
  const [roomList, setRoomList] = useState(roomMockData);

  const [newRoom, setNewRoom] = useState<RoomData>({
    batting: 0,
    maxPlayers: 0,
    players: 0,
    rank: '',
    title: '',
  });

  const handleConfirm = async () => {
    // 서버에 전송할 데이터

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom), // 새로운 방 데이터를 JSON으로 전송
      });

      if (!response.ok) {
        throw new Error('방 생성에 실패했습니다.');
      }

      const data = await response.json();
      console.log('방 생성 성공:', data);

      // 방 생성 후 상태 초기화
      setNewRoom({
        batting: 0,
        maxPlayers: 0,
        players: 0,
        rank: '',
        title: '',
      });
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleClick = () => {
    openModal({
      title: <RoomCreateModalTitle />,
      confirmText: '생성',
      content: <RoomCreateModalContent newRoom={newRoom} setNewRoom={setNewRoom} />,
      onConfirm: handleConfirm,
      onCancel: () => {
        setNewRoom({
          batting: 0,
          maxPlayers: 0,
          players: 0,
          rank: '',
          title: '',
        });
      },
    });
  };

  return (
    <div className='relative flex h-[calc(100dvh-12rem)] flex-col gap-5 p-5'>
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
