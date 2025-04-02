import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import PurchasePanel from '@/components/market/panels/PurchasePanel';
import SellPanel from '@/components/market/panels/SellPanel';
import CoinPanel from '@/components/market/panels/CoinPanel';
import CardpackPanel from '@/components/market/panels/CardpackPanel';

const MarketPage: React.FC = () => {
  return (
    <div className='h-body overflow-y-auto'>
      <Tabs tabList={marketTabList} tabPanels={[<CardpackPanel />, <CoinPanel />, <PurchasePanel />, <SellPanel />]} />
    </div>
  );
};

export default MarketPage;
