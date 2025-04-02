import raceTopBg from '@/assets/images/backgrounds/raceTopBg.webp';
import raceLineBg from '@/assets/images/backgrounds/raceLineBg.webp';

import Horse from '@/components/racetrack/Horse';
import { useEffect, useState } from 'react';

const Race: React.FC = () => {
  const [changePosition, setChangePosition] = useState(0);
  const [h1, setH1] = useState(0);

  useEffect(() => {
    setChangePosition((prev) => {
      if (prev >= 100) {
        return prev;
      } else {
        return prev + 0.005;
      }
    });
  }, [changePosition]);

  const randomBox = [-1, 1];

  useEffect(() => {
    if (changePosition >= 100) {
      setH1(300);
    } else {
      setH1((prev) => prev + 10 * randomBox[Math.floor(Math.random() * 2)]);
    }
  }, [changePosition]);

  return (
    <div className='flex h-full w-full flex-col justify-center bg-[#55da54]'>
      {/* 상단 배경 */}
      <div
        className='flex h-60 w-full flex-col bg-cover bg-no-repeat'
        style={{ backgroundImage: `url(${raceTopBg})`, backgroundPosition: `${changePosition}% 0` }}
      ></div>

      {/* 레이스 */}
      <div className='flex h-full w-full flex-col items-center justify-evenly'>
        <div
          className='flex w-full bg-cover bg-no-repeat'
          style={{
            backgroundPosition: `${changePosition}% 0`,
            backgroundImage: `url(${raceLineBg})`,
          }}
        >
          <div style={{ transform: `translateX(${h1}px)`, transition: 'all 3s' }}>
            <Horse id='fwefwef' color='black' type='auto' direction='change' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Race;
