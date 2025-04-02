import TradeList from '@/components/market/list/TradeList';
import useGetHorseTrading from '@/hooks/useQueries/useGetHorseTrading';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ClipLoader } from 'react-spinners';

interface TradeListPanelProps {
  horseId: string;
}

const TradeListPanel: React.FC<TradeListPanelProps> = ({ horseId }) => {
  const { data, fetchNextPage, hasNextPage } = useGetHorseTrading(horseId);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <TradeList data={data} />
      {hasNextPage && (
        <div ref={ref} className='flex w-full justify-center p-8'>
          <ClipLoader size={18} color='#3D4B63' />
        </div>
      )}
    </>
  );
};

export default TradeListPanel;
