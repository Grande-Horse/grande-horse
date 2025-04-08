import PriceBarChart from '@/components/charts/PriceBarChart';
import { queryKey } from '@/constants/queryKey';
import { getPriceHistory } from '@/services/trading';
import { useSuspenseQuery } from '@tanstack/react-query';

interface PriceHistoryPanelProps {
  horseId: string;
}

const PriceHistoryPanel: React.FC<PriceHistoryPanelProps> = ({ horseId }) => {
  const { data } = useSuspenseQuery({
    queryKey: [queryKey.PRICE_HISTORY, horseId],
    queryFn: () => getPriceHistory(horseId),
  });

  return <PriceBarChart priceHistory={data} />;
};

export default PriceHistoryPanel;
