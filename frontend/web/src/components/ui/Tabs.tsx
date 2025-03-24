import useTabs from '@/hooks/useTabs';
import { TabType } from '@/types/tabList';

interface TabsProps {
  tabList: TabType<string>[];
  tabPanels: React.ReactNode[];
}

const Tabs: React.FC<TabsProps> = ({ tabList, tabPanels }) => {
  const [activeTab, handleActiveTab] = useTabs(tabList.length);

  return (
    <>
      <div className='bg-primary z-tab sticky top-0 flex w-full cursor-pointer divide-x divide-black border-t border-b border-black'>
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
      {tabPanels[activeTab]}
    </>
  );
};

export default Tabs;
