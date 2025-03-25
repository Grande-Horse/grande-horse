import RoomList from '@/components/racetrack/RoomList';
import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';
import useModal from '@/components/ui/modal/useModal';
import { rankMap } from '@/constants/rank';
import { roomMockData } from '@/mocks/datas/room';

const RacetrackPage = () => {
  const { openModal, closeModal } = useModal();

  const handleClick = () => {
    openModal({
      title: <div className='text-heading4 text-stroke font-normal'>방 생성</div>,
      confirmText: '생성',
      content: (
        <div className='flex flex-col gap-3'>
          <Input placeholder='제목' className='text-detail1 placeholder:text-black' />
          <Dropdown options={Object.values(rankMap)} value='인원수' onChange={() => {}} />
          <Dropdown options={Object.values(rankMap)} value='등급제한' onChange={() => {}} />
          <Input placeholder='배팅 코인' className='text-detail1 placeholder:text-black' />
        </div>
      ),
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
        <RoomList rooms={roomMockData} />
      </div>
    </div>
  );
};

export default RacetrackPage;
