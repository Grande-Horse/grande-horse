import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';

interface StatBarProps {
  type: 'speed' | 'acceleration' | 'stamina';
  stat: number;
  total?: number;
}

const StatBar: React.FC<StatBarProps> = ({ type, stat, total }) => {
  if (type === 'speed')
    return (
      <div className='flex items-center gap-2'>
        <SpeedIcon width={20} />
        <div className='bg-epic h-4 rounded-full' style={{ width: stat }}></div>
        <p>{stat}km/h</p>
      </div>
    );

  if (type === 'acceleration')
    return (
      <div className='flex items-center gap-2'>
        <AccelerationIcon width={20} />
        <div className='bg-rare h-4 rounded-full' style={{ width: stat }}></div>
        <p>{stat}km/h</p>
      </div>
    );

  return (
    <div className='flex items-center gap-2'>
      <StaminaIcon width={20} />
      <div className='bg-unique h-4 rounded-full' style={{ width: stat }}></div>
      <p>{stat}%</p>
    </div>
  );
};

export default StatBar;
