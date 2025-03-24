import RoomCard from '@/components/raceTrack/RoomCard';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const RaceTrackPage: React.FC = () => {
  return (
    <div className='flex h-[calc(100dvh-6rem)] flex-col gap-5 p-5'>
      <div>
        <RoomCard />
      </div>
      <div className='flex flex-1 flex-col gap-5'>
        <div className='flex flex-1 items-center justify-center rounded-2xl bg-white/10 inset-shadow-xs inset-shadow-white/10'>
          채팅
        </div>
        <div className='flex gap-3'>
          <Input />
          <Button variant='primary'>Enter</Button>
        </div>
      </div>

      <div className='flex justify-center gap-5'>
        <div className=''>
          <Button
            variant='primary'
            onClick={() => {
              console.log('click');
            }}
          >
            대표말 변경
          </Button>
        </div>
        <div className=''>
          <Button
            variant='primary'
            onClick={() => {
              console.log('click');
            }}
          >
            준비하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RaceTrackPage;
