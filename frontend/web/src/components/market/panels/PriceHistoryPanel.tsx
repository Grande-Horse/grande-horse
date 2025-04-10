import PriceBarChart from '@/components/charts/PriceBarChart';
import { queryKey } from '@/constants/queryKey';
import { getPriceHistory } from '@/services/trading';
import { isExistPriceHistory } from '@/utils/trading';
import { useSuspenseQuery } from '@tanstack/react-query';

interface PriceHistoryPanelProps {
  horseId: string;
}

const PriceHistoryPanel: React.FC<PriceHistoryPanelProps> = ({ horseId }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey.PRICE_HISTORY, horseId],
    queryFn: () => getPriceHistory(horseId),
  });

  if (!isExistPriceHistory(data)) {
    return <div className='flex w-full items-center justify-center py-10'>최근 거래 내역이 없습니다 T-T</div>;
  }

  return <PriceBarChart priceHistory={data} />;
};

export default PriceHistoryPanel;
