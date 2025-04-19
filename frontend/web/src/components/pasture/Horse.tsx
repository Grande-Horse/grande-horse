import { directionMap } from '@/constants/direction';
import { horseImageClass } from '@/constants/horse';
import { useHorseContext } from '@/contexts/pastureHorseContext';
import { HorseCardType } from '@/types/card';
import { useEffect, useState } from 'react';

const curRunClass = {
  left: 'horseRun-left',
  right: 'horseRun-right',
  up: 'horseRun-up',
  down: 'horseRun-down',
} as const;

const curIdleClass = {
  left: 'horseIdle-left',
  right: 'horseIdle-right',
  up: 'horseIdle-up',
  down: 'horseIdle-down',
} as const;

interface HorseProps {
  horseCard: HorseCardType;
  focus?: boolean;
  onClick?: () => void;
}

const Horse: React.FC<HorseProps> = ({ horseCard: { coatColor, cardId }, focus = false, onClick }) => {
  const { horseStates, initHorsePosition, moveHorse } = useHorseContext();
  const [moving, setMoving] = useState(false);
  const [isMounted, setIsmounted] = useState<boolean>(false);

  useEffect(() => {
    initHorsePosition(cardId.toString());
    setIsmounted(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const autoMoveHorse = () => {
      if (focus) {
        return;
      }

      moveHorse(cardId.toString());

      const nextDelay = Math.floor(Math.random() * (5000 - 2200 + 1)) + 2200;
      timeoutId = setTimeout(autoMoveHorse, nextDelay);
    };

    autoMoveHorse();

    return () => clearTimeout(timeoutId);
  }, [focus]);

  if (!isMounted) return null;

  return (
    <div
      onClick={onClick}
      className={`image-rendering-pixelated absolute scale-200 cursor-pointer ${horseImageClass[coatColor]} ${!focus && moving ? curRunClass[directionMap[horseStates[cardId].direction] as keyof typeof curRunClass] : curIdleClass[directionMap[horseStates[cardId].direction] as keyof typeof curIdleClass]}`}
      style={{
        top: `${horseStates[cardId].position.y}px`,
        left: `${horseStates[cardId].position.x}px`,
        transition: 'top 2s, left 2s ease-in-out',
      }}
      onTransitionStart={() => setMoving(true)}
      onTransitionEnd={() => setMoving(false)}
    ></div>
  );
};

export default Horse;
