import { Button } from '@/components/ui/Button';

interface RoomReadyButtonProps {
  isHost?: boolean;
  isReady?: boolean;
  onReadyClick: () => void;
  onStartClick: () => void;
  allUsersReady?: boolean;
}

const RoomReadyButton: React.FC<RoomReadyButtonProps> = ({
  isHost,
  isReady,
  onReadyClick,
  onStartClick,
  allUsersReady,
}) => {
  if (isHost) {
    return <HostButton onClick={onStartClick} disabled={!allUsersReady} />;
  } else {
    return <UserButton isReady={isReady} onReadyClick={onReadyClick} />;
  }
};

export default RoomReadyButton;

interface HostButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const HostButton: React.FC<HostButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button onClick={onClick} disabled={disabled} className='w-full' variant='primary'>
      경기 시작
    </Button>
  );
};

interface UserButtonProps {
  isReady?: boolean;
  onReadyClick: () => void;
}

const UserButton: React.FC<UserButtonProps> = ({ isReady, onReadyClick }) => {
  if (isReady) {
    return (
      <Button onClick={onReadyClick} className={'text-darkgray border-darkgray bg-secondary w-full cursor-pointer'}>
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
