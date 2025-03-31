import HorseProfileCard from '@/components/cards/HorseProfileCard';
import SmallHorseCard from '@/components/cards/SmallHorseCard';
import RaceRecordChart from '@/components/charts/RaceRecordChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { rankMap } from '@/constants/rank';
import { horseListMockData, horseMockData } from '@/mocks/datas/horse';
import { raceRecordMockData } from '@/mocks/datas/race';
import { HorseType } from '@/types/horse';
import { useState } from 'react';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';

const StatPanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [horseList, setHorseList] = useState<HorseType[]>(horseListMockData);
  const [selectedHorse, setSelectedHorse] = useState<HorseType>(horseMockData);

  const horseStats = [
    {
      icon: <RankIcon />,
      label: '등급',
      value: rankMap[selectedHorse.rank as keyof typeof rankMap],
    },
    { icon: <WeightIcon />, label: '체중', value: selectedHorse.weight + 'kg' },
    { icon: <SpeedIcon />, label: '속도', value: selectedHorse.speed + 'km/h' },
    { icon: <AccelerationIcon />, label: '가속도', value: selectedHorse.acceleration + 'km/s' },
    { icon: <StaminaIcon />, label: '지구력', value: selectedHorse.stamina + '%' },
  ];

  return (
    <div className='flex h-full flex-col'>
      <section className='my-5 flex gap-4'>
        <div className='flex-1'>
          <HorseProfileCard name={selectedHorse.name} rank={selectedHorse.rank} coatColor={selectedHorse.coatColor} />
        </div>

        <div className='bg-gradient mr-8 flex flex-3 items-center rounded-sm p-2'>
          {/* <div className='m-auto w-7/8'>
            <RaceRecordChart raceRecord={raceRecordMockData} />
          </div> */}

          <ul className='flex h-full w-full flex-col justify-center pr-3 pl-2'>
            {horseStats.map((stat) => (
              <li key={stat.label} className='flex flex-1 items-center justify-between'>
                <div className='flex items-center'>
                  <span>{stat.icon}</span>
                  <p className='text-black'>{stat.label}</p>
                </div>
                <p className='text-stroke'>{stat.value}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='bg-primary border-t border-b border-black p-4'>
        <Dropdown options={Object.values(rankMap)} value={rank} onChange={setRank} placeholder='등급 선택' />
      </section>

      <section className='grid grid-cols-3 place-items-center py-2'>
        {horseList.map((horse) => (
          <SmallHorseCard horse={horse} />
        ))}
      </section>
    </div>
  );
};

export default StatPanel;
