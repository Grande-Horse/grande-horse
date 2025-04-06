import { Button } from '@/components/ui/Button';
import useModal from '@/components/ui/modal/useModal';

import HorseChangeModal from '@/components/racetrack/HorseChangeModal';
import RoomReadyButton from '@/components/racetrack/RoomReadyButton';
import { type RoomJoinUserData } from '@/types/room';
import { useStompClient } from '@/contexts/StompContext';

interface RoomActionButtonsProps {
  users: RoomJoinUserData[];
  roomId: number;
}

const RoomActionButtons: React.FC<RoomActionButtonsProps> = ({ roomId, users }) => {
  const { publish } = useStompClient();

  // 캐시된 유저 데이터 받아오기
  const userId = Number(localStorage.getItem('userId'));

  const user = users.find((user) => user.userId === userId);
  const { ModalWrapper, openModal, closeModal } = useModal();

  // api요청 또는 publish 요청을 통해서 방에 입장하는 로직 추가 예정
  const handleOpenModal = () => {
    openModal();
  };

  const handleOnReadyClick = () => {
    publish(`/app/race_room/${roomId}/ready`);
  };

  const handleOnStartClick = () => {
    publish(`/app/race_room/${roomId}/start`);
  };

  const allUsersReady = users.filter((user) => !user.roomOwner).every((user) => user.ready);

  return (
    <div className='flex gap-5 px-20'>
      <ModalWrapper>
        <HorseChangeModal close={closeModal} />
      </ModalWrapper>
      <div className='flex-1'>
        <Button variant='primary' className='w-full' onClick={handleOpenModal}>
          대표말 변경
        </Button>
      </div>
      <div className='flex-1'>
        <RoomReadyButton
          isHost={user?.roomOwner}
          isReady={user?.ready}
          onReadyClick={handleOnReadyClick}
          onStartClick={handleOnStartClick}
          allUsersReady={allUsersReady}
        />
      </div>
    </div>
  );
};

export default RoomActionButtons;
