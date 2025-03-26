import { useState, useEffect } from 'react';
import { PastureHorsePositionType, PastureHorseStatusType } from '@/types/horse';

const directionsMap: Record<string, string> = {
  '1,0': 'R',
  '-1,0': 'L',
  '0,1': 'D',
  '0,-1': 'U',
  '0,0': 'S',
};

interface UseHorseMovementProps {
  initialPositions: PastureHorsePositionType[];
  initialDirections: string[];
  horseStatuses: PastureHorseStatusType[];
  gridSize: number;
}

export const useHorseMovement = ({
  gridSize,
  initialPositions,
  initialDirections,
  horseStatuses,
}: UseHorseMovementProps) => {
  const [horsePositions, setHorsePositions] = useState<PastureHorsePositionType[]>(initialPositions);
  const [moveDirections, setMoveDirections] = useState<string[]>(initialDirections);

  useEffect(() => {
    const intervals = horsePositions.map((_, index) => {
      return setInterval(
        () => {
          setHorsePositions((prevPositions) => {
            return prevPositions.map((horse, i) => {
              if (i !== index || horseStatuses[i].isSelected) return horse;

              let newX = horse.x;
              let newY = horse.y;
              const direction = Math.floor(Math.random() * 4);

              switch (direction) {
                case 0:
                  newY = Math.max(0, horse.y - 1);
                  break;
                case 1:
                  newY = Math.min(gridSize - 1, horse.y + 1);
                  break;
                case 2:
                  newX = Math.max(0, horse.x - 1);
                  break;
                case 3:
                  newX = Math.min(gridSize - 1, horse.x + 1);
                  break;
              }

              if (prevPositions.some((pos, idx) => idx !== i && pos.x === newX && pos.y === newY)) {
                return horse;
              }

              setMoveDirections((prevDirections) => {
                const dx = newX - horse.x;
                const dy = newY - horse.y;
                const newDirection = directionsMap[`${dx},${dy}`];
                return prevDirections.map((dir, dirIndex) => (dirIndex === i ? newDirection : dir));
              });

              return { x: newX, y: newY };
            });
          });
        },
        Math.random() * 4000 + 500
      );
    });

    return () => intervals.forEach(clearInterval);
  }, [horsePositions.length, horseStatuses]);

  return { horsePositions, moveDirections };
};
