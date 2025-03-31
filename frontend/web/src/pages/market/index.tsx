import Tabs from '@/components/ui/Tabs';
import { marketTabList } from '@/constants/tabList';
import PurchasePanel from '@/components/market/panels/PurchasePanel';
import SellPanel from '@/components/market/panels/SellPanel';
import { Suspense } from 'react';
import Loading from '@/components/ui/Loading';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import Error from '@/components/ui/Error';
import CoinPanel from '@/components/market/panels/CoinPanel';

const MarketPage: React.FC = () => {
  return (
    <div className='h-body overflow-y-auto'>
      <ErrorBoundary renderFallback={(error) => <Error errorMessage={error?.message} />}>
        <Suspense fallback={<Loading />}>
          <Tabs
            tabList={marketTabList}
            tabPanels={[<div>카드팩</div>, <CoinPanel />, <PurchasePanel />, <SellPanel />]}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default MarketPage;
