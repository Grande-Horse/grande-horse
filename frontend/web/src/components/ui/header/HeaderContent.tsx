import BackIcon from '@/assets/icons/backArrowIcon.svg?react';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import FootIcon from '@/assets/icons/footIcon.svg?react';

interface CurrencyProps {
  coin: number;
  foot: number;
}

interface InfoHeaderProps {
  title?: string;
}

const defaultContent: React.FC<CurrencyProps> = ({ coin, foot }) => (
  <>
    <button className='cursor-pointer'>
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

const infoContent: React.FC<InfoHeaderProps> = ({ title }) => (
  <div className='flex w-full items-center justify-between'>
    <button className='cursor-pointer'>
      <BackIcon />
    </button>

    <div className='flex'>
      <p>{title}</p>
    </div>
    <div className='w-16'></div>
  </div>
);

const waitingRoomContent: React.FC<InfoHeaderProps> = ({ title }) => (
  <>
    <button className='cursor-pointer'>
      <BackIcon />
    </button>
    <div className='bg-secondary ml-10 flex flex-1 justify-center overflow-hidden rounded-xl border-1 p-3 text-black'>
      <p className='line-clamp-1'>{title}</p>
    </div>
  </>
);

const ranchContent: React.FC<CurrencyProps> = ({ coin, foot }) => (
  <>
    <div className='w-16'></div>
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

export { defaultContent, infoContent, waitingRoomContent, ranchContent };
