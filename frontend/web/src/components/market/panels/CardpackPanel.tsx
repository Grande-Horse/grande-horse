import { Button } from '@/components/ui/Button';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import CardpackIcon from '@/assets/icons/cardpackIcon.svg?react';

const CardpackPanel: React.FC = () => {
  return (
    <div className='flex flex-col divide-y divide-black'>
      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <CardpackIcon width={70} height={70} />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-stroke flex gap-3'>
              <p>데일리</p>
              <p>카드팩</p>
            </span>
            <span className='flex items-center gap-2'>
              <CoinIcon width={18} />
              <p>0</p>
            </span>
          </div>
          <p className='text-stroke'>오늘의 말 6장 획득</p>
          <Button className='self-end px-12'>구매</Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <CardpackIcon width={70} height={70} />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-stroke flex gap-3'>
              <p className='text-gray'>노멀</p>
              <p>카드팩</p>
            </span>
            <span className='flex items-center gap-2'>
              <CoinIcon width={18} />
              <p>100</p>
            </span>
          </div>
          <p className='text-stroke'>노멀 등급 이하의 말 획득</p>
          <Button className='self-end px-12'>구매</Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <CardpackIcon width={70} height={70} />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-stroke flex gap-3'>
              <p className='text-rare'>레어</p>
              <p>카드팩</p>
            </span>
            <span className='flex items-center gap-2'>
              <CoinIcon width={18} />
              <p>300</p>
            </span>
          </div>
          <p className='text-stroke'>레어 등급 이하의 말 획득</p>
          <Button className='self-end px-12'>구매</Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <CardpackIcon width={70} height={70} />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-stroke flex gap-3'>
              <p className='text-epic'>에픽</p>
              <p>카드팩</p>
            </span>
            <span className='flex items-center gap-2'>
              <CoinIcon width={18} />
              <p>500</p>
            </span>
          </div>
          <p className='text-stroke'>에픽 등급 이하의 말 획득</p>
          <Button className='self-end px-12'>구매</Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <CardpackIcon width={70} height={70} />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-stroke flex gap-3'>
              <p className='text-unique'>유니크</p>
              <p>카드팩</p>
            </span>
            <span className='flex items-center gap-2'>
              <CoinIcon width={18} />
              <p>1000</p>
            </span>
          </div>
          <p className='text-stroke'>유니크 등급 이하의 말 획득</p>
          <Button className='self-end px-12'>구매</Button>
        </div>
      </div>
    </div>
  );
};

export default CardpackPanel;
