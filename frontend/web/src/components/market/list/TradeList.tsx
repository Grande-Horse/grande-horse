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
      {data.pages.flatMap((page) => {
        if (page.items.length === 0) {
          return <div className='flex w-full items-center justify-center py-10'>최근 거래 내역이 없습니다 T-T</div>;
        }
        return page.items.map((item) => <TradeItem key={item.tradeId} item={item} />);
      })}
    </section>
  );
};

export default TradeList;
