import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';
import ManagementPanel from '@/pages/stall/panels/managementPanel';

const StallPage: React.FC = () => {
  return <Tabs tabList={stableTabList} tabPanels={[<ManagementPanel />, <div>탭 내용2</div>, <div>탭 내용3</div>]} />;
};

export default StallPage;
