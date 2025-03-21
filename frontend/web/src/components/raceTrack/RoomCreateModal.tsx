import { rankMap } from '@/constants/rank';
import Dropdown from '../ui/dropdown/Dropdown';
import Input from '../ui/Input';

const PARTICIPANT_NUMBERS = ['1', '2', '3', '4', '5', '6'];

const RoomCreateModalTitle: React.FC = () => {
  return <div className='text-heading4 text-stroke font-normal'>방 생성</div>;
};

const RoomCreateModalContent: React.FC = () => {
  return (
    <div className='flex w-full flex-col gap-3'>
      <Input placeholder='제목' className='text-detail1 placeholder:text-black' />
      <Dropdown options={PARTICIPANT_NUMBERS} value='인원수' onChange={() => {}} />
      <Dropdown options={Object.values(rankMap)} value='등급제한' onChange={() => {}} />
      <Input placeholder='배팅 코인' className='text-detail1 placeholder:text-black' />
    </div>
  );
};

export { RoomCreateModalTitle, RoomCreateModalContent };
