import { useState } from 'react';
import { Button } from '@/components/ui/Button';

import HorseChangeModal from '@/components/racetrack/HorseChangeModal';
import RoomReadyButton from '@/components/racetrack/RoomReadyButton';
import { useStompClient } from '@/contexts/StompContext';
import useUserInfo from '@/hooks/useQueries/useUserInfo';
import { getAllCandidateHorses } from '@/services/horseManagement';
import { type CandidateHorseType } from '@/types/horse';
import { type RoomJoinUserData } from '@/types/room';

interface RoomActionButtonsProps {
  users: RoomJoinUserData[];
  roomId: number;
}

const RoomActionButtons: React.FC<RoomActionButtonsProps> = ({ roomId, users }) => {
  const { publish } = useStompClient();
  const { data } = useUserInfo();

  const [isOpen, setIsOpen] = useState(false);
  const user = users.find((user) => user.userId === data?.id);

  const [horseList, setHorseList] = useState<CandidateHorseType[]>([]);

  const handleOpenModal = async () => {
    try {
      const response = await getAllCandidateHorses();
      if (response) {
        setHorseList(response);
        setIsOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnReadyClick = () => {
    publish(`/app/race_room/${roomId}/ready`);
  };

  const handleOnStartClick = () => {
    publish(`/app/race_room/${roomId}/start`);
  };

  const allUsersReady =
    users.length === 1 ? false : users.filter((user) => !user.roomOwner).every((user) => user.ready);

  return (
    <div className='flex gap-5 px-20'>
      <div className={` ${isOpen ? 'bg-modal z-modal fixed inset-0 flex items-center justify-center' : 'hidden'}`}>
        <HorseChangeModal
          horseList={horseList}
          onSuccess={(data) => {
            setHorseList(data);
            publish(`/app/race_room/${roomId}/change`, data[0].cardId);
          }}
          setIsOpen={setIsOpen}
        />
      </div>

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
