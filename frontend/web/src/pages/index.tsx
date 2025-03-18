import HorseCard from '@/components/HorseCard';
import Tabs from '@/components/ui/Tabs';
import { stableTabList } from '@/constants/tabList';
import { horseMockData } from '@/mocks/datas/horse';

const HomePage: React.FC = () => {
  return (
    <div className='w-full'>
      <Tabs tabList={stableTabList} tabPanels={[<div>탭 내용1</div>, <div>탭 내용2</div>, <div>탭 내용3</div>]} />

      <div className='mt-10 flex justify-center'>
        <HorseCard horse={horseMockData} />
      </div>
    </div>
  );
};

export default HomePage;
