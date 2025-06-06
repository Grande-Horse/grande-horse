import { useEffect, useState } from 'react';
import Horse from '@/components/racetrack/Horse';
import landingBgLandscape from '@/assets/images/backgrounds/landingBgLandscape.png';
import landingBgCloudUpper from '@/assets/images/backgrounds/landingBgCloudUpper.png';
import landingBgCloudLower from '@/assets/images/backgrounds/landingBgCloudLower.png';
import { CoatColorType } from '@/types/horse';

interface RaceWaitingProps {
  setWaiting: React.Dispatch<React.SetStateAction<boolean>>;
  color: CoatColorType;
}

const RaceWaiting: React.FC<RaceWaitingProps> = ({ setWaiting, color }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000;
    const stepTime = 50;
    const totalSteps = duration / stepTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      setProgress(() => {
        currentStep += 1;
        const newProgress = (currentStep / totalSteps) * 100;
        if (currentStep >= totalSteps) {
          clearInterval(interval);
        }
        return newProgress;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setWaiting(false);
    }
  }, [progress]);

  return (
    <div className='text-stroke text-heading2 relative flex h-full w-full flex-col items-center justify-center'>
      <div className='bg-background/80 z-50 flex flex-col items-center justify-center gap-5 rounded-2xl p-10'>
        <div className='flex w-full'>
          <div>경주 시작 대기 중입니다</div>
          <div className='dot-animation w-10'></div>
        </div>
        <div className='relative h-5 w-full rounded-full bg-gray-300'>
          <div className='bg-primary absolute top-0 left-0 h-full rounded-full' style={{ width: `${progress}%` }}></div>
          <div
            className='bg-secondary absolute top-0 right-0 h-full rounded-full'
            style={{ width: `${100 - progress}%` }}
          ></div>
        </div>

        <div>{Math.round(progress)}%</div>
      </div>

      <div
        className='animate-slide absolute z-20 h-full w-full object-cover'
        style={{ backgroundImage: `url(${landingBgCloudUpper})` }}
      />
      <div
        className='animate-slide absolute z-30 h-full w-full object-cover'
        style={{ backgroundImage: `url(${landingBgCloudLower})` }}
      />

      <div
        className='animate-slide absolute z-10 h-full w-full object-cover'
        style={{ backgroundImage: `url(${landingBgLandscape})` }}
      />

      <div className='absolute z-50 flex h-1/2 flex-col items-end justify-end'>
        <Horse color={color} direction='right' state='run' />
      </div>
    </div>
  );
};

export default RaceWaiting;
