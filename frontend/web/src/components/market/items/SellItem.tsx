import { Button } from '@/components/ui/Button';
import { rankMap, rankTextColor } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';
import { cancelHorseSelling } from '@/services/trading';
import { SoldItemType } from '@/types/trading';
import DotHorseCard from '@/components/cards/DotHorseCard';

interface SellItemProps {
  item: SoldItemType;
}

const SellItem: React.FC<SellItemProps> = ({
  item: { horseId: id, name, coatColor, horseRank: rank, speed, acceleration, stamina, tradeId, price, soldAt },
}) => {
  const handleCancelHorseSelling = async () => {
    const tradeId = 3;

    try {
      await cancelHorseSelling(tradeId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex gap-5 p-5'>
      <div className='w-2/7'>
        <DotHorseCard id={id} name={name} coatColor={coatColor} horseRank={rank} />
      </div>

      <div className='flex grow flex-col justify-between'>
        <div className='flex items-center justify-between'>
          <p className={`text-stroke ${rankTextColor[rank]}`}>{rankMap[rank]}</p>
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
          <Button onClick={handleCancelHorseSelling}>판매 취소</Button>
        </div>
      </div>
    </div>
  );
};

export default SellItem;
