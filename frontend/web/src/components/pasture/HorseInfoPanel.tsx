import HorseProfileCard from '@/components/cards/HorseProfileCard';
import { Button } from '@/components/ui/Button';
import { HorseCardType } from '@/types/card';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';
import { rankMap } from '@/constants/rank';
import { unsetRepresentativeHorse, useRepresentativeHorse, useUpdateCandidateHorse } from '@/services/horseManagement';
import { usePastureHorse } from '@/contexts/PastureHorseContextProvider';

interface HorseInfoPanelProps {
  selectedHorse: HorseCardType | null;
  setSelectedHorse: (horse: HorseCardType | null) => void;
}

const HorseInfoPanel: React.FC<HorseInfoPanelProps> = ({ selectedHorse, setSelectedHorse }) => {
  const { dispatch } = usePastureHorse();
  const candidateMutation = useUpdateCandidateHorse();
  const { setRepresentative: representativeMutation, unsetRepresentative: unsetRepresentativeMutation } =
    useRepresentativeHorse();
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
        <Button
          className='flex-1'
          onClick={() => {
            if (selectedHorse?.status === 3) {
              unsetRepresentativeMutation.mutate(selectedHorse.cardId, {
                onSuccess: () => {
                  dispatch({ type: 'TOGGLE_REPRESENTATIVE_HORSE', payload: null });
                },
              });
            } else {
              representativeMutation.mutate(selectedHorse.cardId, {
                onSuccess: () => {
                  dispatch({ type: 'TOGGLE_REPRESENTATIVE_HORSE', payload: selectedHorse });
                },
              });
            }
          }}
        >
          {selectedHorse?.status === 3 ? '출전마 해제' : '출전마 지정'}
        </Button>
        <Button
          className='flex-1'
          onClick={() => {
            candidateMutation.mutate(selectedHorse.cardId, {
              onSuccess: () => {
                dispatch({ type: 'TOGGLE_CANDIDATE_HORSE', payload: selectedHorse });
                setSelectedHorse(null);
              },
            });
          }}
        >
          후보 말 해제
        </Button>
      </div>
    </section>
  );
};

export default HorseInfoPanel;
