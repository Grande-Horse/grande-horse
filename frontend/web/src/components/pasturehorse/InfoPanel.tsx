import HorseProfileCard from '@/components/cards/HorseProfileCard';
import { Button } from '@/components/ui/Button';
import { rankMap } from '@/constants/rank';
import { HorseType } from '@/types/horse';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';

const InfoPanel = ({ selectedIndex, selectedHorse }: { selectedIndex: number; selectedHorse: HorseType }) => {
  const horseStats = [
    {
      icon: <RankIcon />,
      label: '등급',
      value: rankMap[selectedHorse?.rank as keyof typeof rankMap],
    },
    { icon: <WeightIcon />, label: '체중', value: selectedHorse?.weight + 'kg' },
    { icon: <SpeedIcon />, label: '속도', value: selectedHorse?.speed + 'km/h' },
    { icon: <AccelerationIcon />, label: '가속도', value: selectedHorse?.acceleration + 'km/s' },
    { icon: <StaminaIcon />, label: '지구력', value: selectedHorse?.stamina + '%' },
  ];
  return (
    <div
      className={`${selectedIndex !== -1 ? 'visible' : 'invisible'} bg-background after: my-8 mr-4 flex w-full flex-row rounded-sm bg-[url("src/assets/images/fence.png)] shadow-[0px_10px_5px_0px_rgba(0,_0,_0,_0.2)]`}
    >
      <section className='flex h-full w-full py-5 pr-5'>
        {selectedHorse && (
          <div className='h-full'>
            <HorseProfileCard name={selectedHorse.name} rank={selectedHorse.rank} coatColor={selectedHorse.coatColor} />
          </div>
        )}

        <div className='flex flex-1 flex-col items-center justify-center gap-4 rounded-sm'>
          <div className='bg-gradient flex w-full items-center justify-center rounded-sm'>
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

          <div className='flex items-center justify-center gap-6'>
            <Button>마굿간으로</Button>
            <Button>대표말로 지정</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InfoPanel;
