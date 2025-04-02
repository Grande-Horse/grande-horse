import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import Loading from '@/components/ui/Loading';
import useTabs from '@/hooks/useTabs';
import { TabType } from '@/types/tabList';
import { Suspense } from 'react';
import Error from '@/components/ui/Error';

interface TabsProps {
  tabList: TabType<string>[];
  tabPanels: React.ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabList, tabPanels }) => {
  const [activeTab, handleActiveTab] = useTabs(tabList.length);

  return (
    <>
      <div className='bg-primary z-tab flex w-full cursor-pointer divide-x divide-black border-t border-b border-black'>
        {tabList.map(({ tabId, tabName }) => (
          <div
            key={tabId}
            onClick={() => handleActiveTab(tabId)}
            className={`text-stroke flex flex-1 justify-center p-4 hover:bg-black/20 ${activeTab === tabId ? 'bg-black/20' : ''}`}
          >
            {tabName}
          </div>
        ))}
      </div>
      <ErrorBoundary renderFallback={(error) => <Error errorMessage={error?.message} />}>
        <Suspense fallback={<Loading />}>{tabPanels[activeTab]}</Suspense>
      </ErrorBoundary>
    </>
  );
};

export default Tabs;
