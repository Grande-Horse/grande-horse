import { Button } from '@/components/ui/Button';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import Input from '@/components/ui/Input';
import useModal from '@/components/ui/modal/useModal';
import { rankMap } from '@/constants/rank';

const RaceTrackPage: React.FC = () => {
  const { openModal, closeModal } = useModal();

  const handleClick = () => {
    openModal({
      title: <div className='text-heading4 text-stroke font-normal'>방 생성</div>,
      confirmText: '생성',
      content: (
        <div className='flex w-full flex-col gap-3'>
          <Input placeholder='제목' className='text-detail1 placeholder:text-black' />
          <Dropdown options={Object.values(rankMap)} value='인원수' onChange={() => {}} />
          <Dropdown options={Object.values(rankMap)} value='등급제한' onChange={() => {}} />
          <Input placeholder='배팅 코인' className='text-detail1 placeholder:text-black' />
        </div>
      ),
    });
  };

  return (
    <div className='flex flex-col gap-5 p-5'>
      <Button onClick={handleClick}>모달</Button>
    </div>
  );
};

export default RaceTrackPage;
