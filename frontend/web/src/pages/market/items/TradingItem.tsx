import { Button } from '@/components/ui/Button';
import { HorseType } from '@/types/horse';
import { RankMap } from '@/constants/horse';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';

interface TradingItemProps {
  horse: HorseType;
  price: number;
  isPriceHistoryOpen?: boolean;
  onPriceHistoryClick?: () => void;
}

const TradingItem: React.FC<TradingItemProps> = ({
  horse: { id, name, coatColor, rank, speed, acceleration, stamina },
  price,
  isPriceHistoryOpen = false,
  onPriceHistoryClick,
}) => {
  return (
    <div className='flex gap-5 p-5'>
      {/* TODO: 말 카드 */}
      <div className='bg-primary h-60 w-50'></div>

      <div className='flex grow flex-col justify-between'>
        <div className='flex items-center justify-between'>
          <p>{RankMap[rank]}</p>
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

        <div className='flex gap-4 self-end'>
          {/* TODO: API 연동 */}
          {isPriceHistoryOpen ? (
            <Button onClick={onPriceHistoryClick} variant='secondary'>
              변동 시세 닫기
            </Button>
          ) : (
            <Button onClick={onPriceHistoryClick}>변동 시세 보기</Button>
          )}
          <Button onClick={() => {}}>구매하기</Button>
        </div>
      </div>
    </div>
  );
};

export default TradingItem;
