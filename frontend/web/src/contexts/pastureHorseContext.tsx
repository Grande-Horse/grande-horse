import { directionMap } from '@/constants/direction';
import { HORSE_STEP, PASTURE_MAX_X, PASTURE_MAX_Y, PASTURE_MIN_X, PASTURE_MIN_Y } from '@/constants/pasture';
import { getRandomDirection, getRandomPosition } from '@/utils/random';
import { createContext, useContext, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface HorseState {
  position: Position;
  direction: keyof typeof directionMap;
}

interface HorseContextType {
  horseStates: Record<string, HorseState>;
  initHorsePosition: (id: string) => void;
  moveHorse: (id: string) => void;
}

const HorseContext = createContext<HorseContextType | null>(null);

export const HorseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [horseStates, setHorseStates] = useState<Record<string, HorseState>>({});

  const updateState = (id: string, state: HorseState) => {
    setHorseStates((prev) => ({ ...prev, [id]: state }));
  };

  const initHorsePosition = (id: string) => {
    const randomPos = getRandomPosition(PASTURE_MIN_X, PASTURE_MAX_X, PASTURE_MIN_Y, PASTURE_MAX_Y);
    updateState(id, { position: randomPos, direction: 'RIGHT' });
  };

  const getDistance = (a: Position, b: Position) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const canMoveTo = (id: string, position: Position, state: Record<string, HorseState>) => {
    return !Object.entries(state).some(([otherId, otherState]) => {
      if (otherId === id) return false;
      const distance = getDistance(otherState.position, position);
      return distance < 50; // 말들이 서로 부딪히지 않도록 함 💥
    });
  };

  const moveHorse = (id: string) => {
    setHorseStates((prev) => {
      const prevState = prev[id];
      if (!prevState) return prev;

      let direction = getRandomDirection();
      let { x, y } = prevState.position;
      let nextX, nextY;

      switch (direction) {
        case 'UP':
          nextY = y - HORSE_STEP;
          if (nextY < PASTURE_MIN_Y) direction = 'DOWN';
          break;
        case 'DOWN':
          nextY = y + HORSE_STEP;
          if (nextY > PASTURE_MAX_Y) direction = 'UP';
          break;
        case 'LEFT':
          nextX = x - HORSE_STEP;
          if (nextX < PASTURE_MIN_X) direction = 'RIGHT';
          break;
        case 'RIGHT':
          nextX = x + HORSE_STEP;
          if (nextX > PASTURE_MAX_X) direction = 'LEFT';
          break;
      }

      const finalPosition = {
        x: direction === 'LEFT' ? x - HORSE_STEP : direction === 'RIGHT' ? x + HORSE_STEP : x,
        y: direction === 'UP' ? y - HORSE_STEP : direction === 'DOWN' ? y + HORSE_STEP : y,
      };

      if (!canMoveTo(id, finalPosition, prev)) return prev;

      return {
        ...prev,
        [id]: {
          position: finalPosition,
          direction,
        },
      };
    });
  };

  return (
    <HorseContext.Provider value={{ horseStates, initHorsePosition, moveHorse }}>{children}</HorseContext.Provider>
  );
};

export const useHorseContext = () => {
  const context = useContext(HorseContext);
  if (!context) throw new Error('useHorseContext must be used within a HorseProvider');
  return context;
};
