import SmallHorseCard from '@/components/cards/smallHorseCard';
import { horseMockData } from '@/mocks/datas/horse';

const ManagementPanel: React.FC = () => {
  return (
    <div className='flex flex-wrap justify-around'>
      {Array.from({ length: 20 }).map(() => (
        <SmallHorseCard horse={horseMockData} />
      ))}
    </div>
  );
};

export default ManagementPanel;
