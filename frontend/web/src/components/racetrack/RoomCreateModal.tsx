import { useRef, useState } from 'react';
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
  close: (value: RoomCreateModalReturn | null) => void;
}

const RoomCreateModal = ({ close }: RoomCreateModalProps) => {
  const roomNameInputRef = useRef<HTMLInputElement>(null);
  const [maxPlayers, setMaxPlayers] = useState<string>('');
  const [rankRestriction, setRankRestriction] = useState<RankKrType | ''>('');
  const bettingCoinInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const roomName = roomNameInputRef.current?.value.trim() ?? '';
    const maxPlayersNum = Number(maxPlayers) || 2;

    const bettingRaw = bettingCoinInputRef.current?.value ?? '';
    const bettingCoin = Number(bettingRaw.trim().replace(/['"]/g, '')) || 0;

    close({
      roomName,
      maxPlayers: maxPlayersNum,
      rankRestriction: rankRestriction ? rankNameMap[rankRestriction] : 'all',
      bettingCoin,
    });
  };
  const closeModalWithoutSave = () => {
    close(null);
  };

  const handleDropDownOnChange = (value: string | RankKrType, name: 'maxPlayers' | 'rankRestriction') => {
    if (name === 'maxPlayers') {
      setMaxPlayers(value as string);
    } else {
      setRankRestriction(value as RankKrType);
    }
  };

  return (
    <div className='z-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
        <form className='flex w-full flex-col items-center justify-center gap-3' onSubmit={handleSubmit}>
          <div className='text-heading4 text-stroke font-normal'>방 생성</div>
          <Input
            placeholder='제목'
            id='roomName'
            className='text-detail1 placeholder:text-black'
            ref={roomNameInputRef}
          />
          <Dropdown
            className='text-detail1 w-full'
            options={PARTICIPANT_NUMBERS}
            placeholder='인원수'
            value={maxPlayers}
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
            ref={bettingCoinInputRef}
            className='text-detail1 placeholder:text-black'
          />
          <div className='flex w-full gap-3 pt-5'>
            <Button type='button' className='flex-1' onClick={closeModalWithoutSave}>
              취소
            </Button>
            <Button type='submit' className='flex-1' disabled={!roomNameInputRef.current?.value}>
              생성
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export { RoomCreateModal, type RoomCreateModalReturn };
