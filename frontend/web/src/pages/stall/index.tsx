import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';
import StatPanel from '@/pages/stall/panels/StatPanel';

const StallPage: React.FC = () => {
  return (
    <div className='h-[calc(100vh-12rem)]'>
      <Tabs tabList={stableTabList} tabPanels={[<div>탭 내용1</div>, <StatPanel />, <div>탭 내용3</div>]} />
    </div>
  );
};

export default StallPage;
