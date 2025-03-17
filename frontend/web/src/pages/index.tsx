import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';

const HomePage: React.FC = () => {
  return (
    <div className='w-full'>
      <Tabs tabList={stableTabList} tabPanels={[<div>탭 내용1</div>, <div>탭 내용2</div>, <div>탭 내용3</div>]} />
    </div>
  );
};

export default HomePage;
