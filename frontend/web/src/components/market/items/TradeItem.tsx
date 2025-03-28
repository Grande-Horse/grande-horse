import { HorseType } from '@/types/horse';
import { rankMap } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';

interface TradeItemProps {
  horse: HorseType;
  price: number;
  soldAt: string;
}

const TradeItem: React.FC<TradeItemProps> = ({
  horse: { id, name, coatColor, rank, speed, acceleration, stamina },
  price,
  soldAt: date,
}) => {
  return (
    <div className='flex gap-5 p-5'>
      {/* TODO: 말 카드 */}
      <div className='bg-primary h-60 w-50'></div>

      <div className='flex grow flex-col justify-between'>
        <div className='flex items-center justify-between'>
          <p>{rankMap[rank]}</p>
          <span className='flex items-center gap-2'>
            <CoinIcon width={18} />
            <p>{price}</p>
          </span>
        </div>

        <div className='pb-4'>
          <StatBar type='speed' stat={speed} />
          <StatBar type='acceleration' stat={acceleration} />
          <StatBar type='stamina' stat={stamina} />
        </div>

        <div className='flex self-end'>
          <p>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default TradeItem;
