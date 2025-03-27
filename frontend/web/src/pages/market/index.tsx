import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import PurchasePanel from '@/pages/market/panels/PurchasePanel';
import SellPanel from '@/pages/market/panels/SellPanel';

const MarketPage: React.FC = () => {
  return (
    <div className='h-body overflow-y-auto'>
      <Tabs
        tabList={marketTabList}
        tabPanels={[<div>카드팩</div>, <div>코인</div>, <PurchasePanel />, <SellPanel />]}
      />
    </div>
  );
};

export default MarketPage;
