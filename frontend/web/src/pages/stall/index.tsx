import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';
import ManagementPanel from '@/pages/stall/panels/ManagementPanel';
import StatPanel from '@/components/stall/panels/StatPanel';
import CombinePanel from '@/components/stall/panels/CombinePanel';

const StallPage: React.FC = () => {
  return (
    <div className='h-body'>
      <Tabs tabList={stableTabList} tabPanels={[<ManagementPanel />, <StatPanel />, <CombinePanel />]} />
    </div>
  );
};

export default StallPage;
