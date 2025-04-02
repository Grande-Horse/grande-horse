import { rankMap } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';
import { SoldItemType } from '@/types/trading';
import DotHorseCard from '@/components/cards/DotHorseCard';

interface TradeItemProps {
  item: SoldItemType;
}

const TradeItem: React.FC<TradeItemProps> = ({
  item: { id, name, coatColor, horseRank: rank, speed, acceleration, stamina, tradeId, price, soldAt },
}) => {
  return (
    <div className='flex gap-5 p-5'>
      <div className='w-2/7'>
        <DotHorseCard id={id} name={name} coatColor={coatColor} horseRank={rank} />
      </div>

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
