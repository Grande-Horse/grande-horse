import { rankMap } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';
import { SoldItemType } from '@/types/trading';

interface TradeItemProps {
  item: SoldItemType;
}

const TradeItem: React.FC<TradeItemProps> = ({
  item: { id, name, coatColor, rank, speed, acceleration, stamina, tradeId, price, soldAt },
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
          <p>{soldAt}</p>
        </div>
      </div>
    </div>
  );
};

export default TradeItem;
