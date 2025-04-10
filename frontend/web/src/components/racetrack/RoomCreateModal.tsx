import { useState } from 'react';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { rankMap, rankNameMap } from '@/constants/rank';
import { RankKrType, type RankType } from '@/types/horse';

const PARTICIPANT_NUMBERS = ['2', '3', '4', '5', '6'];

interface RoomCreateModalReturn {
  roomName: string;
  maxPlayers: number;
  rankRestriction: RankType;
  bettingCoin: number;
}

interface RoomCreateModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_ROOM_NAME_LENGTH = 20;

const RoomCreateModal = () => {
  const [roomName, setRoomName] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<number>(0);
  const [rankRestriction, setRankRestriction] = useState<RankKrType | ''>('');
  const [bettingCoin, setBettingCoin] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleDropDownOnChange = (value: string | RankKrType, name: 'maxPlayers' | 'rankRestriction') => {
    if (name === 'maxPlayers') {
      setMaxPlayers(Number(value));
    } else {
      setRankRestriction(value as RankKrType);
    }
  };
  const isFormValid =
    roomName.trim().length > 0 &&
    roomName.trim().length <= 20 &&
    maxPlayers > 0 &&
    rankRestriction !== '' &&
    bettingCoin > 0 &&
    bettingCoin <= 99999;

  return (
    <div className='z-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
        <form className='flex w-full flex-col items-center justify-center gap-3' onSubmit={handleSubmit}>
          <div className='text-heading4 text-stroke font-normal'>방 생성</div>
          <Input
            placeholder='제목'
            id='roomName'
            className='text-detail1 placeholder:text-black'
            value={roomName}
            onChange={(e) => {
              if (e.target.value.length <= MAX_ROOM_NAME_LENGTH) {
                setRoomName(e.target.value);
              }
            }}
          />
          <Dropdown
            className='text-detail1 w-full'
            options={PARTICIPANT_NUMBERS}
            placeholder='인원수'
            value={maxPlayers === 0 ? '' : String(maxPlayers)}
            onChange={(value) => handleDropDownOnChange(value, 'maxPlayers')}
          />
          <Dropdown
            className='text-detail1 w-full'
            options={Object.values(rankMap)}
            placeholder='등급'
            value={rankRestriction}
            onChange={(value) => handleDropDownOnChange(value, 'rankRestriction')}
          />
          <Input
            placeholder='배팅 코인'
            id='bettingCoin'
            type='number'
            value={bettingCoin === 0 ? '' : bettingCoin}
            onChange={(e) => {
              const rawValue = e.target.value;
              if (!/^\d*$/.test(rawValue)) return;
              const numericValue = Math.min(Number(rawValue), 999999);
              setBettingCoin(numericValue);
            }}
            className='text-detail1 placeholder:text-black'
            max={999999}
          />
          <div className='flex w-full gap-3 pt-5'>
            <Button type='button' className='flex-1' onClick={closeModalWithoutSave}>
              취소
            </Button>
            <Button type='submit' className='flex-1' disabled={!isFormValid}>
              생성
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export { RoomCreateModal, type RoomCreateModalReturn };
