import Dropdown from '@/components/ui/dropdown/Dropdown';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

import { rankMap, rankNameMap } from '@/constants/rank';
import { RoomCreateData } from '@/types/room';
import { useRef, useState } from 'react';

const PARTICIPANT_NUMBERS = ['2', '3', '4', '5', '6'];

export type RoomCreateModalReturn = {
  roomName: string;
  maxPlayers: number;
  rankRestriction: string;
  bettingCoin: number;
};

type RoomCreateModalProps = {
  close: (value: RoomCreateModalReturn | null) => void;
};

const RoomCreateModal = ({ close }: RoomCreateModalProps) => {
  const roomNameInputRef = useRef<HTMLInputElement>(null);
  const [maxPlayers, setMaxPlayers] = useState<string>('');
  const [rankRestriction, setRankRestriction] = useState<string>('');
  const bettingCoinInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    close({
      roomName: roomNameInputRef.current?.value ?? '',
      maxPlayers: Number(maxPlayers) ?? 2,
      rankRestriction: rankRestriction ?? 'normal',
      bettingCoin: Number(bettingCoinInputRef.current?.value) ?? 0,
    });
  };

  const closeModalWithoutSave = () => {
    close(null);
  };

  const handleDropDownOnChange = (value: string, name: 'maxPlayers' | 'rankRestriction') => {
    if (name === 'maxPlayers') {
      setMaxPlayers(value);
    } else {
      setRankRestriction(value);
    }
  };

  return (
    <div className='z-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
        <form className='flex w-full flex-col justify-center gap-3' onSubmit={handleSubmit}>
          <div className='text-heading4 text-stroke font-normal'>방 생성</div>
          <Input
            placeholder='제목'
            id='roomName'
            className='text-detail1 placeholder:text-black'
            ref={roomNameInputRef}
          />
          <Dropdown
            className='text-detail1'
            options={PARTICIPANT_NUMBERS}
            placeholder='인원수'
            value={maxPlayers}
            onChange={(value) => handleDropDownOnChange(value, 'maxPlayers')}
          />
          <Dropdown
            className='text-detail1'
            options={Object.values(rankMap)}
            placeholder='등급'
            value={rankRestriction}
            onChange={(value) => handleDropDownOnChange(value, 'rankRestriction')}
          />
          <Input
            placeholder='배팅 코인'
            id='bettingCoin'
            type='number'
            ref={bettingCoinInputRef}
            className='text-detail1 placeholder:text-black'
          />
          <div className='flex w-full justify-end gap-3'>
            <Button type='button' onClick={closeModalWithoutSave}>
              취소
            </Button>
            <Button type='submit'>생성</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RoomCreateModal;
