import TradeItem from '@/components/market/items/TradeItem';
import { CursorResponse } from '@/types/service/response';
import { SoldItemType } from '@/types/trading';
import { InfiniteData } from '@tanstack/react-query';

interface TradeListProps {
  data: InfiniteData<CursorResponse<SoldItemType>>;
}

const TradeList: React.FC<TradeListProps> = ({ data }) => {
  return (
    <section className='divide-y-1 divide-black'>
      {data.pages.flatMap((page) => page.items.map((item) => <TradeItem key={item.tradeId} item={item} />))}
    </section>
  );
};

export default TradeList;
