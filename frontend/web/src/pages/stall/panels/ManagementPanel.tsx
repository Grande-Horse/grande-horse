import PastureIcon from '@/assets/icons/pastureIcon.svg?react';
import SmallHorseCard from '@/components/cards/SmallHorseCard';
import Dropdown from '@/components/ui/dropdown/Dropdown';
import { horseImageClass } from '@/constants/horse';
import { rankMap, rankNameMap } from '@/constants/rank';
import { horseCardListMockData } from '@/mocks/datas/horse';
import { useState, useEffect } from 'react';
import { usePastureHorse } from '@/contexts/PastureHorseContextProvider';
import { Button } from '@/components/ui/Button';
import CrownIcon from '@/assets/icons/crownIcon.svg?react';
import useInfiniteScroll from '@/hooks/useQueries/useInfiniteScroll';
import { HorseCardType } from '@/types/card';
import { queryKey } from '@/constants/queryKey';
import { getMyHorseCards } from '@/services/stall';
import { ClipLoader } from 'react-spinners';

const pastureBgUrl = `bg-[url('@/assets/images/backgrounds/managementPastureBg.webp')] bg-contain bg-center`;

const ManagementPanel: React.FC = () => {
  const [rank, setRank] = useState<string>('');
  const [horseList, setHorseList] = useState<HorseCardType[]>(horseCardListMockData);
  const [currentIndex, setcurrentIndex] = useState<number>(0);
  const [candidateHorses, setPastureHorses] = useState<HorseCardType[]>([]);
  const [isSettingCandidateHorse, setIsSettingCandidateHorse] = useState<boolean>(false);

  const { state, dispatch } = usePastureHorse();

  useEffect(() => {
    setPastureHorses(state.candidateHorses);

    // 말이 제거된 경우 인덱스 조정
    if (currentIndex >= state.candidateHorses.length && state.candidateHorses.length > 0) {
      setcurrentIndex(state.candidateHorses.length - 1);
    } else if (state.candidateHorses.length === 0) {
      setcurrentIndex(0);
    }
  }, [state.candidateHorses, currentIndex]);

  const handleSetCandidateHorses = (horse: HorseCardType) => {
    console.log(horse);
    dispatch({ type: 'SET_CANDIDATE_HORSES', payload: horse });

    // 현재 마당에 있는 말들 중에서 선택한 말의 인덱스를 찾음
    const existingIndex = candidateHorses.findIndex((h) => h.horseId === horse.horseId);

    if (existingIndex >= 0) {
      // 이미 마당에 있는 말이면 해당 인덱스로 설정
      setcurrentIndex(existingIndex);
    } else if (candidateHorses.length < state.maxHorses) {
      // 새로 추가된 말이면 마지막 인덱스로 설정
      setcurrentIndex(candidateHorses.length);
    }
  };

  const handleSetRepresentativeHorse = async (horse: HorseCardType) => {
    if (candidateHorses[currentIndex]) {
      console.log(horse);
      dispatch({ type: 'SET_REPRESENTATIVE_HORSE', payload: horse });
    }
  };

  const ChangeHorseButton = ({ type }: { type: 'minus' | 'plus' }) => {
    const handleChangeIndex = (type: 'minus' | 'plus') => {
      if (type === 'minus') setcurrentIndex(currentIndex === 0 ? candidateHorses.length - 1 : currentIndex - 1);
      else setcurrentIndex((currentIndex + 1) % candidateHorses.length);
    };
    return (
      <button onClick={() => handleChangeIndex(type)} className='flex h-8 w-8 items-center justify-center rounded-full'>
        {type === 'minus' ? (
          <div className='h-0 w-0 border-t-[8px] border-r-[12px] border-b-[8px] border-t-transparent border-r-white border-b-transparent' />
        ) : (
          <div className='h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white' />
        )}
      </button>
    );
  };

  const PastureHorsesIndicator = () => {
    return (
      <div className='flex h-2 gap-2'>
        {candidateHorses.map((horse, index) => (
          <button
            key={horse.horseId}
            onClick={() => setcurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-primary'}`}
          />
        ))}
      </div>
    );
  };

  const SelectedHorseInfo = () => {
    return (
      <>
        <div className='flex flex-col items-center gap-10'>
          <CrownIcon
            className={`${candidateHorses[currentIndex] === state.representativeHorse ? 'block' : 'invisible'}`}
            width={32}
            height={32}
          />
          <div className='flex items-center gap-10'>
            <ChangeHorseButton type='minus' />
            <div className={`relative rounded-[100%] ${pastureBgUrl} h-24 w-100 shadow-md`}>
              {candidateHorses[currentIndex] && (
                <div
                  className={`image-rendering-pixelated absolute left-[44%] scale-200 cursor-pointer ${horseImageClass[candidateHorses[currentIndex].coatColor]} horseRun-right`}
                />
              )}
            </div>
            <ChangeHorseButton type='plus' />
          </div>
          <div className='h-10'>{candidateHorses[currentIndex]?.name}</div>
          <PastureHorsesIndicator />
        </div>
      </>
    );
  };

  // 에러 메시지 표시 컴포넌트
  const ErrorMessage = () => {
    if (!state.error) return null;

    return (
      <div className='text-warning relative mb-4 rounded border bg-red-100 px-4 py-3' role='alert'>
        <span className='block sm:inline'>{state.error}</span>
      </div>
    );
  };

  // 말 수 표시 컴포넌트
  const HorsesCountIndicator = () => {
    return (
      <div className='my-4 flex justify-start px-4 text-gray-700'>
        <div
          className={`flex items-center gap-2 rounded-full px-4 ${candidateHorses.length === state.maxHorses ? 'bg-green-400' : 'bg-white'}`}
        >
          <PastureIcon />

          <span className='block sm:inline'>
            {candidateHorses.length} / {state.maxHorses} 마리
          </span>
        </div>
      </div>
    );
  };

  const { data, hasNextPage, ref } = useInfiniteScroll(
    queryKey.MY_HORSE_CARDS,
    getMyHorseCards,
    rankNameMap[rank as keyof typeof rankNameMap]
  );

  return (
    <div className='flex h-full flex-col'>
      {/* <ErrorMessage /> */}
      <section className='mt-10 flex flex-col items-center justify-center gap-4'>
        <SelectedHorseInfo />
      </section>
      <div className='flex items-center justify-around gap-2'>
        <HorsesCountIndicator />
        <div className='flex gap-2'>
          <Button
            onClick={() =>
              candidateHorses.length > 0 &&
              handleSetCandidateHorses({
                ...candidateHorses[currentIndex],
                cardId: parseInt(candidateHorses[currentIndex].horseId, 10),
                status: 0,
              })
            }
            disabled={candidateHorses.length === 0}
          >
            마당에서 제거
          </Button>
          <Button
            onClick={() => handleSetRepresentativeHorse(candidateHorses[currentIndex])}
            disabled={candidateHorses.length === 0}
          >
            대표말 지정
          </Button>
        </div>
      </div>
      <section className='bg-primary border-t border-b border-black p-4'>
        <Dropdown options={Object.values(rankMap)} value={rank} onChange={setRank} placeholder='등급 선택' />
      </section>
      <div
        className={`top-0 left-0 z-10 aspect-[320/492] cursor-pointer flex-col items-center justify-between bg-contain bg-center bg-no-repeat`}
      >
        <section className='grid grid-cols-3 place-items-center px-1 py-2'>
          {data.pages.flatMap((page) =>
            page.items.map((item) => (
              <SmallHorseCard key={item.tradeId} horse={item} onClick={() => handleSetCandidateHorses(item)} />
            ))
          )}
        </section>
        {hasNextPage && (
          <div ref={ref} className='flex w-full justify-center p-8'>
            <ClipLoader size={18} color='#3D4B63' />
          </div>
        )}
        {/* <div */}
        {/*   className={`absolute top-0 left-0 z-10 h-full w-full rounded-xl ${isInPasture ? 'bg-modal' : ''}`} */}
        {/*   onClick={() => handleSetCandidateHorses(horse)} */}
        {/*   style={{ zIndex: isInPasture ? 10 : 0 }} */}
        {/* /> */}
        {/* <SmallHorseCard */}
        {/*   key={horse.horseId} */}
        {/*   onClick={() => handleSetCandidateHorses(horse)} */}
        {/*   horse={{ ...horse, cardId: parseInt(horse.horseId, 10), status: 0 }} */}
        {/* /> */}
      </div>
    </div>
  );
};

export default ManagementPanel;
