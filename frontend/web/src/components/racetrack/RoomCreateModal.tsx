import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';

import { rankMap, rankNameMap } from '@/constants/rank';
import { RoomCreateData } from '@/types/room';
import { useEffect, useState } from 'react';

const PARTICIPANT_NUMBERS = ['2', '3', '4', '5', '6'];

interface RoomCreateModalContent {
  newRoom: RoomCreateData;
  setNewRoom: React.Dispatch<React.SetStateAction<RoomCreateData>>;
}

const RoomCreateModalTitle: React.FC = () => {
  return <div className='text-heading4 text-stroke font-normal'>방 생성</div>;
};

const RoomCreateModalContent: React.FC<RoomCreateModalContent> = ({ newRoom, setNewRoom }) => {
  const [roomData, setRoomData] = useState<RoomCreateData>(newRoom);

  const handleDropDownOnChange = (value: string, name: 'maxPlayers' | 'rankRestriction') => {
    setRoomData((prev) => {
      const updatedValue = name === 'maxPlayers' ? Number(value) : rankNameMap[value as keyof typeof rankNameMap];
      return { ...prev, [name]: updatedValue };
    });
  };

  const handleOnChange = (e: any) => {
    setRoomData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  useEffect(() => {
    setNewRoom(roomData);
  }, [roomData]);

  return (
    <div className='flex w-full flex-col gap-3'>
      <Input
        placeholder='제목'
        id='roomName'
        className='text-detail1 placeholder:text-black'
        value={roomData.roomName}
        onChange={handleOnChange}
      />
      <Dropdown
        className='text-detail1'
        options={PARTICIPANT_NUMBERS}
        placeholder='인원수'
        value={roomData.maxPlayers >= 2 ? `${roomData.maxPlayers.toString()}` : ''}
        onChange={(value) => handleDropDownOnChange(value, 'maxPlayers')}
      />
      <Dropdown
        className='text-detail1'
        options={Object.values(rankMap)}
        placeholder='등급'
        value={roomData.rankRestriction ? `${rankMap[roomData.rankRestriction]}` : ''}
        onChange={(value) => handleDropDownOnChange(value, 'rankRestriction')}
      />
      <Input
        placeholder='배팅 코인'
        id='bettingCoin'
        type='number'
        value={roomData.bettingCoin === 0 ? '' : roomData.bettingCoin}
        className='text-detail1 placeholder:text-black'
        onChange={handleOnChange}
      />
    </div>
  );
};

export { RoomCreateModalTitle, RoomCreateModalContent };
