import { Button } from '@/components/ui/Button';
import SellItem from '@/components/market/items/SellItem';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { queryKey } from '@/constants/queryKey';
import { getMyHorseTrading } from '@/services/trading';
import { ClipLoader } from 'react-spinners';
import HorseSelectModal from '@/components/market/modal/HorseSelectModal';
import { useDialog } from '@/contexts/confirmDialogContext';

const SellPanel: React.FC = () => {
  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_TRADING, getMyHorseTrading);

  const { isOpen, openDialog } = useDialog();

  return (
    <div className='flex h-full flex-col divide-y divide-black'>
      {isOpen && <HorseSelectModal />}

      <section className='flex h-1/3 shrink-0 flex-col items-center justify-center gap-4'>
        <HorseDealIcon />
        <Button onClick={openDialog}>말 판매</Button>
      </section>

      <div className='bg-primary flex items-center gap-4 p-4'>
        <p className='text-stroke text-body2'>말 판매 내역</p>
      </div>

      <section className='divide-y-1 divide-black'>
        {data?.pages.flatMap((page) => page.items.map((item) => <SellItem key={item.tradeId} item={item} />))}
      </section>

      {hasNextPage && (
        <div ref={ref} className='flex w-full justify-center p-8'>
          <ClipLoader size={18} color='#3D4B63' />
        </div>
      )}
    </div>
  );
};

export default SellPanel;
