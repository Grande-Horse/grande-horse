import { Button } from '@/components/ui/Button';
import { rankMap, rankTextColor } from '@/constants/rank';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';
import StatBar from '@/components/charts/StatBar';
import { purchaseHorse } from '@/services/trading';
import { RegisteredItemType } from '@/types/trading';
import DotHorseCard from '@/components/cards/DotHorseCard';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKey } from '@/constants/queryKey';

interface PurchaseItemProps {
  item: RegisteredItemType;
  isPriceHistoryOpen?: boolean;
  onPriceHistoryClick?: () => void;
}

const PurchaseItem: React.FC<PurchaseItemProps> = ({
  item: { horseId: id, name, coatColor, horseRank: rank, speed, acceleration, stamina, tradeId, price, registeredAt },
  isPriceHistoryOpen = false,
  onPriceHistoryClick,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => purchaseHorse(tradeId),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [queryKey.TRADING] });
      alert('구매 완료하였습니다.');
    },
  });

  const handlePurchaseHorse = () => {
    mutation.mutate();
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
