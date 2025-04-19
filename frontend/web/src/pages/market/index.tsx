import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import PurchasePanel from '@/components/market/panels/PurchasePanel';
import SellPanel from '@/components/market/panels/SellPanel';
import CoinPanel from '@/components/market/panels/CoinPanel';
import CardpackPanel from '@/components/market/panels/CardpackPanel';
import { DialogProvider } from '@/contexts/confirmDialogContext';

const MarketPage: React.FC = () => {
  return (
    <DialogProvider>
      <div className='h-body overflow-y-auto'>
        <Tabs
          tabList={marketTabList}
          tabPanels={[<PurchasePanel />, <SellPanel />, <CardpackPanel />, <CoinPanel />]}
        />
      </div>
    </DialogProvider>
  );
};

export default MarketPage;
