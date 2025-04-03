import React, { useState, useEffect, useContext } from 'react';
import { PastureHorse } from '@/components/pasturehorse/PastureHorse';
import { getRandomDirection, getRandomPosition } from '@/components/pasturehorse/horsePositionUtils';
import { HorseType, PastureHorseStatusType } from '@/types/horse';
import { useHorseMovement } from '@/hooks/useHorseMovement';
import { horseListMockData } from '@/mocks/datas/horse';
import InfoPanel from '@/components/pasturehorse/InfoPanel';

const GRID_SIZE = 6;
const CELL_SIZE = 80;
const IMAGE_SIZE = { x: 78, y: 77 };
const HORSE_COUNT = 3;

// 초기 말 위치, 클릭 상태, 방향
const initialPositions = Array.from({ length: HORSE_COUNT }, () => getRandomPosition(GRID_SIZE, []));
const initialDirections = Array.from({ length: HORSE_COUNT }, () => getRandomDirection());
const initialStatuses = Array.from({ length: HORSE_COUNT }, () => ({
  isSelected: false,
  isMoving: false,
  velocity: Math.min(5, Math.random() * 20),
}));

const gridStyle = {
  display: 'grid',
  margin: '0 auto',
  width: `${GRID_SIZE * CELL_SIZE}px`,
  height: `${GRID_SIZE * CELL_SIZE}px`,
  maxHeight: `${GRID_SIZE * CELL_SIZE}px`,
  maxWidth: `${GRID_SIZE * CELL_SIZE}px`,
  gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
  gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
};

const HomePage: React.FC = () => {
  const [selectedHorse, setSelectedHorse] = useState<HorseType | null>(null);
  const [horseStatuses, setHorseStatuses] = useState<PastureHorseStatusType[]>(initialStatuses);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const { horsePositions, moveDirections } = useHorseMovement({
    gridSize: GRID_SIZE,
    initialPositions,
    initialDirections,
    horseStatuses,
  });

  // 말 클릭 시 선택 상태 변경
  const onHorseClick = (index: number) => {
    setSelectedIndex((prevIndex) => (prevIndex === index ? -1 : index));
    setSelectedHorse(horseListMockData[index]);
    setHorseStatuses((prevStatuses) =>
      prevStatuses.map((status, i) => ({
        ...status,
        isSelected: i === index ? !status.isSelected : false,
        isMoving: false,
      }))
    );
  };

  return (
    <div className='flex h-full flex-col items-center bg-[linear-gradient(to_bottom,rgba(173,193,254,0.8),rgba(114,147,255,0.8))]'>
      <div className='h-full'>
        <InfoPanel selectedIndex={selectedIndex} selectedHorse={selectedHorse as HorseType} />
      </div>
      <div
        className="relative grid bg-[rgba(101,207,91,0.98)] before:absolute before:top-0 before:left-0 before:h-[30px] before:w-full before:bg-[url('/src/assets/images/fence.png')] before:bg-repeat-x after:absolute after:bottom-0 after:left-0 after:h-[30px] after:w-full after:bg-[url('/src/assets/images/fence.png')] after:bg-repeat-x"
        style={gridStyle}
      >
        {horsePositions.map((horse, i) => (
          <PastureHorse
            key={i}
            position={horse}
            direction={moveDirections[i]}
            status={horseStatuses[i]}
            onClick={() => onHorseClick(i)}
            imageSize={IMAGE_SIZE}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
