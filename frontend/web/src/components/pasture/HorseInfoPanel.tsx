import HorseProfileCard from '@/components/cards/HorseProfileCard';
import { Button } from '@/components/ui/Button';
import { HorseCardType } from '@/types/card';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';
import { rankMap } from '@/constants/rank';

interface HorseInfoPanelProps {
  selectedHorse: HorseCardType;
}

const HorseInfoPanel: React.FC<HorseInfoPanelProps> = ({ selectedHorse }) => {
  const horseStats = [
    {
      icon: <RankIcon />,
      label: '등급',
      value: rankMap[selectedHorse?.horseRank as keyof typeof rankMap],
    },
    { icon: <WeightIcon />, label: '체중', value: selectedHorse?.weight + 'kg' },
    { icon: <SpeedIcon />, label: '속도', value: selectedHorse?.speed + 'km/h' },
    { icon: <AccelerationIcon />, label: '가속도', value: selectedHorse?.acceleration + 'km/h' },
    { icon: <StaminaIcon />, label: '지구력', value: selectedHorse?.stamina + '%' },
  ];

  return (
    <section className='bg-background absolute top-0 flex w-10/11 flex-col items-center justify-center rounded-sm py-5 pr-7 pl-3 inset-shadow-sm inset-shadow-white/30'>
      <div className='flex w-full'>
        <div className='shrink-1 self-start'>
          <HorseProfileCard
            name={selectedHorse.name}
            rank={selectedHorse.horseRank}
            coatColor={selectedHorse.coatColor}
          />
        </div>

        <div className='bg-gradient flex flex-2 items-center rounded-sm p-2'>
          <ul className='flex w-full flex-col justify-center truncate pr-3 pl-2'>
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
      </div>

      <div className='mt-4 flex w-full gap-5 pl-4'>
        <Button className='flex-1'>경주마로 지정</Button>
        <Button className='flex-1'>목장에서 제거</Button>
      </div>
    </section>
  );
};

export default HorseInfoPanel;
