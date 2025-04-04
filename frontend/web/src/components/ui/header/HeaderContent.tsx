import BackIcon from '@/assets/icons/backArrowIcon.svg?react';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import FootIcon from '@/assets/icons/footIcon.svg?react';
import { useStompClient } from '@/context/StompContext';
import useInternalRouter from '@/hooks/useInternalRouter';

interface DefaultContentProps {
  coin: number;
  foot: number;
}

interface TitleContentProps {
  title: string;
}

interface RaceTrackRoomContentProps extends TitleContentProps {
  state: { roomId?: number; maxPlayers?: number };
}

const DefaultContent: React.FC<DefaultContentProps> = ({ coin, foot }) => {
  const { goBack } = useInternalRouter();

  return (
    <>
      <button className='cursor-pointer' onClick={goBack}>
        <BackIcon />
      </button>

      <div className='flex gap-6'>
        <div className='flex items-center justify-center gap-3'>
          <CoinIcon />
          <p className='text-stroke'>{coin.toLocaleString()}</p>
        </div>
        <div className='flex items-center justify-center gap-3'>
          <FootIcon />
          <p className='text-stroke'>{foot.toLocaleString()}</p>
        </div>
      </div>
    </>
  );
};

const StallContent: React.FC<TitleContentProps> = ({ title }) => {
  const { goBack } = useInternalRouter();

  return (
    <div className='flex w-full items-center justify-between'>
      <button className='cursor-pointer' onClick={goBack}>
        <BackIcon />
      </button>

      <div className='flex'>
        <p className='text-heading3'>{title ?? ''}</p>
      </div>
      <div className='w-16'></div>
    </div>
  );
};

const RaceTrackContent: React.FC<DefaultContentProps> = ({ coin, foot }) => {
  const { goBack } = useInternalRouter();
  const { unsubscribeAll } = useStompClient();

  const handleClick = () => {
    unsubscribeAll();
    goBack();
  };

  return (
    <>
      <button className='cursor-pointer' onClick={handleClick}>
        <BackIcon />
      </button>

      <div className='flex gap-6'>
        <div className='flex items-center justify-center gap-3'>
          <CoinIcon />
          <p className='text-stroke'>{coin.toLocaleString()}</p>
        </div>
        <div className='flex items-center justify-center gap-3'>
          <FootIcon />
          <p className='text-stroke'>{foot.toLocaleString()}</p>
        </div>
      </div>
    </>
  );
};

const RaceTrackRoomContent: React.FC<RaceTrackRoomContentProps> = ({ title, state }) => {
  const { goBack } = useInternalRouter();
  const { unsubscribeAll, publish } = useStompClient();
  const handleClick = () => {
    publish(`/app/race_room/${state.roomId}/leave`);
    unsubscribeAll();
    goBack();
  };
  return (
    <>
      <button className='cursor-pointer' onClick={handleClick}>
        <BackIcon />
      </button>
      <div className='bg-secondary ml-10 flex flex-1 justify-center overflow-hidden rounded-xl border-1 p-3 text-black'>
        <p className='line-clamp-1'>{title}</p>
      </div>
    </>
  );
};

export { DefaultContent, StallContent, RaceTrackContent, RaceTrackRoomContent };
