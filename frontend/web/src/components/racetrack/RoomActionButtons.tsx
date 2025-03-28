import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';

import { HorseChangeModalTitle, HorseChangeModalContent } from '@/components/racetrack/HorseChangeModal';
import RoomReadyButton from '@/components/racetrack/RoomReadyButton';

const RoomActionButtons: React.FC = () => {
  const { openModal } = useModal();

  const handleOnClick = () => {
    openModal({
      title: <HorseChangeModalTitle />,
      content: <HorseChangeModalContent />,
    });
  };

  return (
    <div className='flex gap-5 px-20'>
      <div className='flex-1'>
        <Button variant='primary' className='w-full' onClick={handleOnClick}>
          대표말 변경
        </Button>
      </div>
      <div className='flex-1'>
        <RoomReadyButton
          isHost={false}
          isReady={false}
          onCancelClick={() => {
            console.log('클릭');
          }}
          onReadyClick={() => {}}
          onStartClick={() => {}}
        />
      </div>
    </div>
  );
};

export default RoomActionButtons;
