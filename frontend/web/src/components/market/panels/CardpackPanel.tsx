import { Button } from '@/components/ui/Button';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import DailyCardpackIcon from '@/assets/icons/dailyCardpackIcon.svg?react';
import NormalCardpackIcon from '@/assets/icons/normalCardpackIcon.svg?react';
import RareCardpackIcon from '@/assets/icons/rareCardpackIcon.svg?react';
import EpicCardpackIcon from '@/assets/icons/epicCardpackIcon.svg?react';
import UniqueCardpackIcon from '@/assets/icons/uniqueCardpackIcon.svg?react';
import { buyCardpack, buyDailyCardpack } from '@/services/cardpack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKey } from '@/constants/queryKey';
import { useNavigate } from 'react-router-dom';
import useInternalRouter from '@/hooks/useInternalRouter';

const CardpackPanel: React.FC = () => {
  const { push } = useInternalRouter();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (cardpackId: number) => buyCardpack(cardpackId),
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: [queryKey.COIN] });
      push('/market/card/result', { state: { data } });
    },
  });

  const handleBuyButtonClick = async (cardpackId: number) => {
    await mutation.mutateAsync(cardpackId);
  };

  const handleDailyCardpackButtonClick = async () => {
    const result = await buyDailyCardpack();
    push('/market/card/result', result);
  };

  return (
    <div className='flex flex-col divide-y divide-black'>
      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <DailyCardpackIcon width={70} height={70} />
        </div>
        <div className='flex h-40 grow flex-col justify-center gap-2'>
          <div className='flex items-center justify-between'>
            <span className='text-stroke flex gap-3'>
              <p className='text-legend'>데일리</p>
              <p>카드팩</p>
            </span>
            <span className='flex items-center gap-2'>
              <CoinIcon width={18} />
              <p>0</p>
            </span>
          </div>
          <p className='text-stroke'>오늘의 말 6장 획득</p>
          <Button onClick={handleDailyCardpackButtonClick} className='self-end px-12'>
            구매
          </Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <NormalCardpackIcon width={70} height={70} />
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
          <Button onClick={() => handleBuyButtonClick(2)} className='self-end px-12'>
            구매
          </Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <RareCardpackIcon width={70} height={70} />
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
          <Button onClick={() => handleBuyButtonClick(3)} className='self-end px-12'>
            구매
          </Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <EpicCardpackIcon width={70} height={70} />
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
          <Button onClick={() => handleBuyButtonClick(4)} className='self-end px-12'>
            구매
          </Button>
        </div>
      </div>

      <div className='flex gap-8 px-8 py-6'>
        <div className='bg-primary flex h-40 w-40 items-center justify-center rounded-sm'>
          <UniqueCardpackIcon width={70} height={70} />
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
          <Button onClick={() => handleBuyButtonClick(5)} className='self-end px-12'>
            구매
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardpackPanel;
