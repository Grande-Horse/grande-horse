import { HorseCardType } from '@/types/card';

import { useRef, useState, useEffect } from 'react';
import Horse from '@/components/pasture/Horse';
import HorseInfoPanel from '@/components/pasture/HorseInfoPanel';
import { usePastureHorse } from '@/contexts/PastureHorseContextProvider';
import { useHorseContext } from '@/contexts/pastureHorseContext';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

const HomePage: React.FC = () => {
  const [selectedHorse, setSelectedHorse] = useState<HorseCardType | null>(null);
  const { dispatch, state } = usePastureHorse();

  useUserInfo();

  const horseSoundRef = useRef<HTMLAudioElement>(null);
  const horseSoundRef2 = useRef<HTMLAudioElement>(null);

  const handleHorseClick = (horse: HorseCardType) => {
    setSelectedHorse((prev) => {
      if (prev?.cardId === horse.cardId) {
        if (horseSoundRef2.current) {
          horseSoundRef2.current.volume = 0.3;
          horseSoundRef2.current.play();
        }
        return null;
      } else {
        if (horseSoundRef.current) {
          horseSoundRef.current.volume = 0.3;
          horseSoundRef.current.play();
        }
        return horse;
      }
    });
  };

  // 페이지 변경 시 selectedHorse 초기화
  useEffect(() => {
    return () => {
      dispatch({ type: 'SELECT_HORSE', payload: null });
    };
  }, []);

  return (
    <div className='h-body relative flex w-full items-center justify-center'>
      <div className='w-base fixed top-0 h-screen bg-[url(@/assets/images/backgrounds/pastureBg.png)] bg-cover bg-left bg-no-repeat'></div>
      {state.candidateHorses.map((horse) => (
        <Horse
          key={horse.cardId}
          horseCard={horse}
          focus={selectedHorse?.cardId === horse.cardId}
          onClick={() => handleHorseClick(horse)}
        />
      ))}

      {selectedHorse && <HorseInfoPanel selectedHorse={selectedHorse} />}

      <audio ref={horseSoundRef} src='/music/horse.mp3' />
      <audio ref={horseSoundRef2} src='/music/horse2.mp3' />
    </div>
  );
};

export default HomePage;
