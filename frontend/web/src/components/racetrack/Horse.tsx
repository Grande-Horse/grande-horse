import { horseImageClass } from '@/constants/horse';

type CoatColorType = 'black' | 'lightbrown' | 'brown' | 'darkbrown' | 'gray';

interface HorseProps {
  color: CoatColorType;
  direction: 'left' | 'right' | 'up' | 'down';
  state?: 'run' | 'idle';
}

const Horse: React.FC<HorseProps> = ({ color, direction, state = 'idle' }) => {
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

  return (
    <div className='relative flex size-36 items-center justify-center p-2'>
      <div
        className={`image-rendering-pixelated ${state === 'run' ? curRunClass[direction] : curIdleClass[direction]} absolute scale-200 ${horseImageClass[color]} `}
      ></div>
    </div>
  );
};

export default Horse;
