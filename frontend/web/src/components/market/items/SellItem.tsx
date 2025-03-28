import { Button } from '@/components/ui/Button';
import { HorseType } from '@/types/horse';
import { rankMap } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';
import { cancelHorseSelling } from '@/services/trading';

interface SellItemProps {
  horse: HorseType;
  price: number;
  isSold?: boolean;
}

const SellItem: React.FC<SellItemProps> = ({
  horse: { id, name, coatColor, rank, speed, acceleration, stamina },
  price,
  isSold: isCompleted = false,
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
          {isCompleted ? (
            <Button disabled>판매 완료</Button>
          ) : (
            <Button onClick={handleCancelHorseSelling}>판매 취소</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellItem;
