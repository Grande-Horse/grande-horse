import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import PurchasePanel from '@/components/market/panels/PurchasePanel';
import SellPanel from '@/components/market/panels/SellPanel';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const MarketPage: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-body overflow-y-auto'>
        <Tabs
          tabList={marketTabList}
          tabPanels={[<div>카드팩</div>, <div>코인</div>, <PurchasePanel />, <SellPanel />]}
        />
      </div>
    </QueryClientProvider>
  );
};

export default MarketPage;
