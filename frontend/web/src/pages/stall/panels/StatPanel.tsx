import HorseProfileCard from '@/components/cards/HorseProfileCard';
import SmallHorseCard from '@/components/cards/SmallHorseCard';
import RaceRecordChart from '@/components/charts/RaceRecordChart';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { RankMap } from '@/constants/horse';
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
      value: RankMap[selectedHorse.rank as keyof typeof RankMap],
    },
    { icon: <WeightIcon />, label: '체중', value: selectedHorse.weight + 'kg' },
    { icon: <SpeedIcon />, label: '속도', value: selectedHorse.speed + 'km/h' },
    { icon: <AccelerationIcon />, label: '가속도', value: selectedHorse.acceleration + 'km/s' },
    { icon: <StaminaIcon />, label: '지구력', value: selectedHorse.stamina + '%' },
  ];

  return (
    <div className='flex flex-col divide-y-1 divide-black'>
      <section className='flex py-5 pr-5'>
        <div>
          <HorseProfileCard name={selectedHorse.name} rank={selectedHorse.rank} coatColor={selectedHorse.coatColor} />
        </div>

        <div className='bg-gradient flex flex-1 items-center justify-center rounded-sm'>
          {/* TODO: 캐러셀 구현 */}
          {/* <section className='max-h-56 p-2'>
            <RaceRecordChart raceRecord={raceRecordMockData} />
          </section> */}

          <ul className='flex h-full w-full flex-col p-3 pr-4'>
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

      <section className='bg-primary p-4'>
        <Dropdown options={Object.values(RankMap)} value={rank} onChange={setRank} placeholder='등급 선택' />
        {/* TODO: Search Input */}
      </section>

      <section className='flex flex-wrap justify-evenly p-4'>
        {horseList.map((horse) => (
          <SmallHorseCard horse={horse} />
        ))}
      </section>
    </div>
  );
};

export default StatPanel;
