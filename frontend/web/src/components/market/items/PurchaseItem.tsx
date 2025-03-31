import { Button } from '@/components/ui/Button';
import { rankMap } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';
import { purchaseHorse } from '@/services/trading';
import { RegisteredItemType } from '@/types/trading';

interface PurchaseItemProps {
  item: RegisteredItemType;
  isPriceHistoryOpen?: boolean;
  onPriceHistoryClick?: () => void;
}

const PurchaseItem: React.FC<PurchaseItemProps> = ({
  item: { id, name, coatColor, rank, speed, acceleration, stamina, tradeId, price, registeredAt },
  isPriceHistoryOpen = false,
  onPriceHistoryClick,
}) => {
  const handlePurchaseHorse = async () => {
    const tradeId = 1;
    try {
      await purchaseHorse(tradeId);
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

        <div className='flex gap-4 self-end'>
          {isPriceHistoryOpen ? (
            <Button onClick={onPriceHistoryClick} variant='secondary'>
              변동 시세 닫기
            </Button>
          ) : (
            <Button onClick={onPriceHistoryClick}>변동 시세 보기</Button>
          )}
          <Button onClick={handlePurchaseHorse}>구매하기</Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseItem;
