import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';
import StatPanel from '@/components/stall/panels/StatPanel';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import Loading from '@/components/ui/Loading';
import { Suspense } from 'react';
import Error from '@/components/ui/Error';

const StallPage: React.FC = () => {
  return (
    <div className='h-body'>
      <ErrorBoundary renderFallback={(error) => <Error errorMessage={error?.message} />}>
        <Suspense fallback={<Loading />}>
          <Tabs tabList={stableTabList} tabPanels={[<div>탭 내용1</div>, <StatPanel />, <div>탭 내용3</div>]} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default StallPage;
