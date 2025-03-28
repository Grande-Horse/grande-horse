import { PastureHorsePositionType } from '@/types/horse';

// 랜덤 방향을 생성하는 함수
export const getRandomDirection = () => {
  const directions = ['U', 'D', 'L', 'R'];
  return directions[Math.floor(Math.random() * directions.length)];
};

// 중복되지 않는 랜덤 위치 생성
export const getRandomPosition = (
  gridSize: number,
  existingPositions: PastureHorsePositionType[]
): PastureHorsePositionType => {
  let newPosition: PastureHorsePositionType;
  do {
    newPosition = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (existingPositions.some((pos) => pos.x === newPosition.x && pos.y === newPosition.y));

  return newPosition;
};
