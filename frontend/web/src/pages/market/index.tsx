import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import TradingPanel from '@/pages/market/panels/TradingPanel';

const MarketPage: React.FC = () => {
  return (
    <div className='h-body overflow-y-auto'>
      <Tabs tabList={marketTabList} tabPanels={[<div>카드팩</div>, <div>코인</div>, <TradingPanel />]} />
    </div>
  );
};

export default MarketPage;
