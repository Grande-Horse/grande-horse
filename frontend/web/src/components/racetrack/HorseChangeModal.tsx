import { useState } from 'react';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';

import Horse from '@/components/racetrack/Horse';
import { Button } from '@/components/ui/Button';

import { type CandidateHorseType } from '@/types/horse';

interface HorseChangeModalProps {
  onSuccess: (data: CandidateHorseType[]) => void;
  horseList: CandidateHorseType[];
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const HorseChangeModal: React.FC<HorseChangeModalProps> = ({ onSuccess, horseList, setIsOpen }) => {
  const bgImageClass = {
    all: '',
    normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
    rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
    epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
    unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
    legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
  } as const;

  const [selectedHorseId, setSelectedHorseId] = useState<string | null>(null);

  const [activeHorseStates, setActiveHorseStates] = useState<boolean[]>(new Array(horseList.length).fill(false));

  const handleCardClick = (horseId: string) => {
    setSelectedHorseId((prevId) => (prevId === horseId ? null : horseId));
  };

  const handleSelectedClick = () => {
    setSelectedHorseId(null);
  };

  const setActiveHorse = (index: number, isActive: boolean) => {
    setActiveHorseStates((prev) => {
      const newStates = [...prev];
      newStates[index] = isActive;
      return newStates;
    });
  };

  const handleChangeClick = () => {
    onSuccess(horseList.filter((horse) => String(horse.horseId) === selectedHorseId));
    setSelectedHorseId(null);
    setActiveHorseStates(new Array(horseList.length).fill(false));
    setIsOpen(false);
  };

  const handleCancelClick = () => {
    setSelectedHorseId(null);
    setActiveHorseStates(new Array(horseList.length).fill(false));
    setIsOpen(false);
  };

  return (
    <div className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
      <div className='text-heading4 text-stroke pb-5 font-normal'>대표말 변경</div>
      <div className='mb-4 grid grid-cols-3 gap-5'>
        {horseList.map((horse, idx) => {
          const isSelected = String(horse.horseId) === selectedHorseId;
          const isActiveHorse = activeHorseStates[idx];
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
                onClick={() => handleCardClick(String(horse.horseId))}
                onMouseLeave={() => setActiveHorse(idx, false)}
                onMouseEnter={() => setActiveHorse(idx, true)}
                onTouchStart={() => setActiveHorse(idx, true)}
                className={`${bgImageClass[horse.horseRank]} outline-secondary flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-cover bg-center pt-5 hover:outline-4 hover:outline-dashed active:outline-dashed`}
              >
                <p className='text-detail2 text-stroke flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
                  {horse.name}
                </p>
                <Horse
                  color={horse.coatColor}
                  key={horse.horseId}
                  direction='right'
                  state={isActiveHorse ? 'run' : 'idle'}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className='flex w-full gap-3 pt-5'>
        <Button className='flex-1' onClick={handleCancelClick}>
          취소
        </Button>
        <Button className='flex-1' onClick={handleChangeClick}>
          변경
        </Button>
      </div>
    </div>
  );
};

export default HorseChangeModal;
