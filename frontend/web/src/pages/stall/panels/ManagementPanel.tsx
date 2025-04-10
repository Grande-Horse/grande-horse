import PastureIcon from '@/assets/icons/pastureIcon.svg?react';
import SelectedIcon from '@/assets/icons/selectedIcon.svg?react';
import SmallHorseCard from '@/components/cards/SmallHorseCard';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { horseImageClass } from '@/constants/horse';
import { rankMap, rankNameMap } from '@/constants/rank';
import { useState, useEffect } from 'react';
import { usePastureHorse } from '@/contexts/PastureHorseContextProvider';
import { Button } from '@/components/ui/Button';
import CrownIcon from '@/assets/icons/crownIcon.svg?react';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { HorseCardType } from '@/types/card';
import { queryKey } from '@/constants/queryKey';
import { getMyHorseCards } from '@/services/stall';
import { ClipLoader } from 'react-spinners';
import { useRepresentativeHorse, useUpdateCandidateHorse } from '@/services/horseManagement';

const pastureBgUrl = `bg-[url('@/assets/images/backgrounds/managementPastureBg.webp')] bg-contain bg-center`;

const ManagementPanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [currentHorseId, setCurrentHorseId] = useState<number | null>(null);
  const { state, dispatch } = usePastureHorse();

  useEffect(() => {
    if (state.candidateHorses.length === 0) {
      setCurrentHorseId(null);
    } else if (!state.candidateHorses.some((h) => h.cardId === currentHorseId)) {
      setCurrentHorseId(state.candidateHorses[0].cardId);
    }
  }, [state.candidateHorses, currentHorseId]);

  const getCurrentHorse = () => {
    return state.candidateHorses.find((h) => h.cardId === currentHorseId) ?? null;
  };

  const ChangeHorseButton = ({ type }: { type: 'minus' | 'plus' }) => {
    const handleChangeIndex = (type: 'minus' | 'plus') => {
      if (state.candidateHorses.length === 0 || currentHorseId === null) return;
      const currentIndex = state.candidateHorses.findIndex((h) => h.cardId === currentHorseId);
      if (currentIndex === -1) return;
      const newIndex =
        type === 'minus'
          ? currentIndex === 0
            ? state.candidateHorses.length - 1
            : currentIndex - 1
          : (currentIndex + 1) % state.candidateHorses.length;
      setCurrentHorseId(state.candidateHorses[newIndex].cardId);
    };

    return (
      <button
        onClick={() => handleChangeIndex(type)}
        className='flex h-8 w-8 items-center justify-center rounded-full'
        disabled={state.candidateHorses.length === 0}
      >
        {type === 'minus' ? (
          <div className='h-0 w-0 border-t-[8px] border-r-[12px] border-b-[8px] border-t-transparent border-r-white border-b-transparent' />
        ) : (
          <div className='h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white' />
        )}
      </button>
    );
  };

  const PastureHorsesIndicator = () => (
    <div className='bg-primary flex h-8 w-40 max-w-full items-center justify-center gap-2 rounded-full'>
      {state.candidateHorses.map((horse) => {
        const isCurrent = horse.cardId === currentHorseId;
        const isRepresentative = horse.status === 3 || state.representativeHorse?.cardId === horse.cardId;

        return (
          <div key={horse.cardId} className='relative flex h-4 w-4 items-center justify-center'>
            <button
              onClick={() => setCurrentHorseId(horse.cardId)}
              className={`h-2 w-2 rounded-full transition-colors ${isCurrent ? 'bg-white' : 'bg-background'}`}
            />
          </div>
        );
      })}
    </div>
  );

  const SelectedHorseInfo = () => {
    const currentHorse = getCurrentHorse();
    const isRepresentative = currentHorse?.status === 3 || state.representativeHorse?.cardId === currentHorse?.cardId;

    return (
      <div className='flex flex-col items-center gap-8'>
        <PastureHorsesIndicator />
        <div className='flex items-center gap-10'>
          <ChangeHorseButton type='minus' />
          <div className={`relative rounded-[100%] ${pastureBgUrl} h-24 w-100 shadow-md`}>
            {currentHorse && (
              <div
                className={`image-rendering-pixelated absolute left-[44%] scale-200 cursor-pointer ${horseImageClass[currentHorse.coatColor]} horseRun-right`}
              />
            )}
          </div>
          <ChangeHorseButton type='plus' />
        </div>
        <div className='flex items-center gap-2'>
          {isRepresentative && <CrownIcon width={20} height={20} />}
          <div className='h-10'>{currentHorse?.name || '선택된 말이 없습니다'}</div>
        </div>
      </div>
    );
  };

  const HorsesCountIndicator = () => (
    <div className='my-2 flex px-4 text-white'>
      <div className={`bg-primary flex items-center gap-2 rounded-full px-4`}>
        <PastureIcon />
        <span>{state.candidateHorses.length} / 6 마리</span>
      </div>
    </div>
  );

  const candidateMutation = useUpdateCandidateHorse();
  const { setRepresentative: representativeMutation, unsetRepresentative: unsetRepresentativeMutation } =
    useRepresentativeHorse();

  const handleToggleRepresentative = (horse: HorseCardType) => {
    if (horse.status === 3) {
      unsetRepresentativeMutation.mutate(horse.cardId, {
        onSuccess: () => {
          dispatch({ type: 'TOGGLE_REPRESENTATIVE_HORSE', payload: null });
        },
      });
    } else {
      representativeMutation.mutate(horse.cardId, {
        onSuccess: () => {
          dispatch({ type: 'TOGGLE_REPRESENTATIVE_HORSE', payload: { ...horse, status: 3 } });
        },
      });
    }
  };

  const { data, hasNextPage, ref } = useInfiniteScroll(queryKey.MY_HORSE_CARDS, getMyHorseCards);

  return (
    <div className='flex h-full flex-col'>
      <section className='my-10 flex flex-col items-center justify-center gap-2'>
        <SelectedHorseInfo />
        <div className='flex w-full items-center justify-center gap-2'>
          <Button
            onClick={() => {
              const currentHorse = getCurrentHorse();
              if (currentHorse) {
                handleToggleRepresentative(currentHorse);
              }
            }}
            disabled={state.candidateHorses.length === 0}
          >
            {getCurrentHorse()?.status === 3 ? '경주마 해제' : '경주마 지정'}
          </Button>
        </div>
      </section>
      <section className='bg-primary border-t border-b border-black p-4'>
        <Dropdown
          options={Object.values(rankMap)}
          value={rank}
          onChange={(value) => {
            setRank(value);
          }}
          placeholder='전체'
        />
      </section>
      <div>
        <HorsesCountIndicator />
        <section className='grid grid-cols-3 place-items-center px-1 py-2'>
          {data.pages.flatMap((page) =>
            page.items.map((item) => (
              <div
                key={item.cardId}
                className='relative z-10'
                onClick={() => {
                  candidateMutation.mutate(item.cardId, {
                    onSuccess: () => {
                      dispatch({ type: 'TOGGLE_CANDIDATE_HORSE', payload: item });
                      setCurrentHorseId(item.cardId);
                    },
                  });
                }}
              >
                {(item.status === 2 || item.status === 3) && (
                  <div className='absolute inset-0 z-20 flex h-65.5 w-44 items-center justify-center self-center rounded-xl bg-black/60'>
                    <SelectedIcon />
                  </div>
                )}

                <SmallHorseCard horse={item} />
              </div>
            ))
          )}
        </section>
        {hasNextPage && (
          <div ref={ref} className='flex w-full justify-center p-8'>
            <ClipLoader size={18} color='#3D4B63' />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementPanel;
