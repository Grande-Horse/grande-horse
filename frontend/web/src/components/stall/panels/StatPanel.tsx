import HorseProfileCard from '@/components/cards/HorseProfileCard';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { rankMap, rankNameMap } from '@/constants/rank';
import { Suspense, useState } from 'react';
import CardList from '@/components/stall/list/CardList';
import { HorseCardType } from '@/types/card';
import RaceRecordChart from '@/components/charts/RaceRecordChart';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';
import ErrorBoundary from '@/components/ui/errorBoundary/ErrorBoundary';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const StatPanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [selectedHorse, setSelectedHorse] = useState<HorseCardType>();

  const [index, setIndex] = useState<number>(0);

  const handleCardClick = (horse: HorseCardType) => {
    setSelectedHorse(horse);
  };

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
    <div className='flex h-full flex-col divide-y divide-black'>
      {selectedHorse ? (
        <section className='flex w-full justify-center gap-4 py-5'>
          <div className='h-54 flex-1'>
            <HorseProfileCard
              name={selectedHorse.name}
              rank={selectedHorse.horseRank}
              coatColor={selectedHorse.coatColor}
            />
          </div>

          <div className='mr-8 flex-2'>
            <div className='bg-gradient flex h-54 items-center rounded-sm p-2'>
              {index === 1 ? (
                <ErrorBoundary renderFallback={(error) => <Error errorMessage={error?.message} />}>
                  <Suspense fallback={<Loading />}>
                    <div className='m-auto w-7/8'>
                      <RaceRecordChart cardId={selectedHorse.cardId} />
                    </div>
                  </Suspense>
                </ErrorBoundary>
              ) : (
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
              )}
            </div>

            <div className='flex w-full justify-center gap-3 pt-5'>
              <div
                onClick={() => setIndex(0)}
                className={`h-2 w-2 cursor-pointer rounded-full ${index === 0 ? 'bg-white' : 'bg-primary'}`}
              ></div>
              <div
                onClick={() => setIndex(1)}
                className={`bg-primary h-2 w-2 cursor-pointer rounded-full ${index === 1 ? 'bg-white' : 'bg-primary'}`}
              ></div>
            </div>
          </div>
        </section>
      ) : (
        <div className='flex justify-center py-[7rem]'>능력치 및 전적을 확인할 말을 선택해 주세요!</div>
      )}

      <section className='bg-primary p-4'>
        <Dropdown options={Object.values(rankMap)} value={rank} onChange={setRank} placeholder='전체' />
      </section>

      <ErrorBoundary renderFallback={(error) => <Error errorMessage={error?.message} />}>
        <Suspense fallback={<Loading />}>
          <CardList rank={rankNameMap[rank as keyof typeof rankNameMap]} onClick={handleCardClick} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default StatPanel;
