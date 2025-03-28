import { Button } from '@/components/ui/Button';

interface RoomReadyButtonProps {
  isHost: boolean;
  isReady: boolean;
  onReadyClick: () => void;
  onCancelClick: () => void;
  onStartClick: () => void;
}

const RoomReadyButton: React.FC<RoomReadyButtonProps> = ({
  isHost,
  isReady,
  onReadyClick,
  onCancelClick,
  onStartClick,
}) => {
  if (isHost) {
    return <HostButton onClick={onStartClick} />;
  } else {
    return <UserButton isReady={isReady} onReadyClick={onReadyClick} onCancelClick={onCancelClick} />;
  }
};

export default RoomReadyButton;

interface HostButtonProps {
  onClick: () => void;
}

const HostButton: React.FC<HostButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} className='w-full' variant='primary'>
      경기 시작
    </Button>
  );
};

interface UserButtonProps {
  isReady: boolean;
  onReadyClick: () => void;
  onCancelClick: () => void;
}

const UserButton: React.FC<UserButtonProps> = ({ isReady, onReadyClick, onCancelClick }) => {
  if (!isReady) {
    return (
      <Button onClick={onCancelClick} className={'text-darkgray border-darkgray bg-secondary w-full cursor-pointer'}>
        준비취소
      </Button>
    );
  } else {
    return (
      <Button onClick={onReadyClick} className='w-full' variant='primary'>
        준비하기
      </Button>
    );
  }
};
