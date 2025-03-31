import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import PurchasePanel from '@/components/market/panels/PurchasePanel';
import SellPanel from '@/components/market/panels/SellPanel';
import CoinPanel from '@/components/market/panels/CoinPanel';

const MarketPage: React.FC = () => {
  return (
    <div className='h-body overflow-y-auto'>
      <Tabs tabList={marketTabList} tabPanels={[<div>카드팩</div>, <CoinPanel />, <PurchasePanel />, <SellPanel />]} />
    </div>
  );
};

export default MarketPage;
