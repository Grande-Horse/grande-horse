import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';

const StallPage: React.FC = () => {
  return <Tabs tabList={stableTabList} tabPanels={[<div>탭 내용1</div>, <div>탭 내용2</div>, <div>탭 내용3</div>]} />;
};

export default StallPage;
