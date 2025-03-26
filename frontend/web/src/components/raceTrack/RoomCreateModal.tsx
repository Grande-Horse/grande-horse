import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';

import { rankMap, rankNameMap } from '@/constants/rank';
import { RoomData } from '@/types/room';
import { useState } from 'react';

const PARTICIPANT_NUMBERS = ['2', '3', '4', '5', '6'];

interface RoomCreateModalContent {
  newRoom: RoomData;
  setNewRoom: React.Dispatch<React.SetStateAction<RoomData>>;
}

const RoomCreateModalTitle: React.FC = () => {
  return <div className='text-heading4 text-stroke font-normal'>방 생성</div>;
};

const RoomCreateModalContent: React.FC<RoomCreateModalContent> = ({ newRoom, setNewRoom }) => {
  const [roomData, setRoomData] = useState<RoomData>(newRoom);

  const handleDropDownOnChange = (value: string, name: 'maxPlayers' | 'rank') => {
    setRoomData((prev) => {
      const updatedValue = name === 'maxPlayers' ? Number(value) : rankNameMap[value as keyof typeof rankNameMap];
      return { ...prev, [name]: updatedValue };
    });

    setNewRoom(() => {
      const updatedValue = name === 'maxPlayers' ? Number(value) : rankNameMap[value as keyof typeof rankNameMap];
      return { ...roomData, [name]: updatedValue };
    });
  };

  const handleOnChange = (e: any) => {
    setRoomData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });

    setNewRoom(() => {
      return { ...roomData, [e.target.id]: e.target.value };
    });
  };

  return (
    <div className='flex w-full flex-col gap-3'>
      <Input
        placeholder='제목'
        id='title'
        className='text-detail1 placeholder:text-black'
        value={roomData.title}
        onChange={handleOnChange}
      />
      <Dropdown
        className='text-detail1'
        options={PARTICIPANT_NUMBERS}
        placeholder='인원수'
        value={roomData.maxPlayers >= 2 ? `${roomData.maxPlayers}` : ''}
        onChange={(value) => handleDropDownOnChange(value, 'maxPlayers')}
      />
      <Dropdown
        className='text-detail1'
        options={Object.values(rankMap)}
        placeholder='등급'
        value={roomData.rank ? `${rankMap[roomData.rank]}` : ''}
        onChange={(value) => handleDropDownOnChange(value, 'rank')}
      />
      <Input
        placeholder='배팅 코인'
        id='batting'
        type='number'
        value={roomData.batting === 0 ? '' : roomData.batting}
        className='text-detail1 placeholder:text-black'
        onChange={handleOnChange}
      />
    </div>
  );
};

export { RoomCreateModalTitle, RoomCreateModalContent };
