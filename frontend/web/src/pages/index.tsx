import { HorseCardType } from '@/types/card';
import { useRef, useState } from 'react';
import Horse from '@/components/pasture/Horse';
import HorseInfoPanel from '@/components/pasture/HorseInfoPanel';
import { useHorseContext } from '@/contexts/pastureHorseContext';

const HomePage: React.FC = () => {
  const { horseList } = useHorseContext();
  const [selectedHorse, setSelectedHorse] = useState<HorseCardType | null>(null);

  const horseSoundRef = useRef<HTMLAudioElement>(null);
  const horseSoundRef2 = useRef<HTMLAudioElement>(null);

  const handleHorseClick = (horse: HorseCardType) => {
    setSelectedHorse((prev) => {
      if (prev?.cardId === horse.cardId) {
        if (horseSoundRef2.current) {
          horseSoundRef2.current.play();
        }
        return null;
      } else {
        if (horseSoundRef.current) {
          horseSoundRef.current.play();
        }
        return horse;
      }
    });
  };

  return (
    <div className='h-body relative flex w-full items-center justify-center'>
      <div className='w-base fixed top-0 h-screen bg-[url(@/assets/images/backgrounds/pastureBg.png)] bg-cover bg-left bg-no-repeat'></div>
      {horseList.map((horse) => (
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
