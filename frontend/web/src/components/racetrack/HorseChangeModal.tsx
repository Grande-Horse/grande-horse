import { useState } from 'react';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';

import Horse from '@/components/racetrack/Horse';
import { userMockData } from '@/mocks/datas/user';

const HorseChangeModalTitle: React.FC = () => {
  return <div className='text-heading4 text-stroke pb-5 font-normal'>대표말 변경</div>;
};

const HorseChangeModalContent: React.FC = () => {
  const bgImageClass = {
    normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
    rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
    epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
    unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
    legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
  } as const;

  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);
  const handleCardClick = (horseId: string) => {
    setSelectedHorseId((prevId) => (prevId === horseId ? null : horseId));
  };

  const handleSelectedClick = () => {
    setSelectedHorseId(null);
  };

  return (
    <div className='mb-4 grid grid-cols-3 gap-5'>
      {userMockData.map((horse, idx) => {
        const isSelected = String(horse.id) === selectedHorseId;
        return (
          <div className='relative' key={`change ${idx}`}>
            {isSelected && (
              <div
                onClick={handleSelectedClick}
                className='bg-primary/60 outline-primary/70 absolute z-20 flex h-full w-full cursor-pointer items-center justify-center rounded-2xl outline-4'
              >
                <SelectedIcon />
              </div>
            )}
            <div
              key={`horse ${idx}`}
              onClick={() => handleCardClick(String(horse.id))}
              className={`${bgImageClass[horse.rank]} outline-secondary flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-cover bg-center pt-5 hover:outline-4 hover:outline-dashed active:outline-dashed`}
            >
              <p className='text-detail2 text-stroke flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
                {horse.userName}
              </p>
              <Horse id={String(Math.random())} color={horse.coatColor} key={horse.id} direction='change' />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { HorseChangeModalTitle, HorseChangeModalContent };
