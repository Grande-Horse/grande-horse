import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';
import StatPanel from '@/components/stall/panels/StatPanel';
import CombinePanel from '@/components/stall/panels/CombinePanel';

const StallPage: React.FC = () => {
  return (
    <div className='h-body'>
      <Tabs tabList={stableTabList} tabPanels={[<div>탭 내용1</div>, <StatPanel />, <CombinePanel />]} />
    </div>
  );
};

export default StallPage;
