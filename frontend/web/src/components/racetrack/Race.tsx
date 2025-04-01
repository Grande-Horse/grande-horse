import raceTopBg from '@/assets/images/backgrounds/raceTopBg.webp';
import raceLineBg from '@/assets/images/backgrounds/raceLineBg.webp';

import Horse from '@/components/racetrack/Horse';

const Race: React.FC = () => {
  return (
    <div className='flex h-full w-full flex-col justify-center bg-[#55da54]'>
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='flex h-40 w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceTopBg})` }}></div>

        <div className='flex h-full w-full flex-1 flex-col items-center justify-center'>
          <div className='flex w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceLineBg})` }}>
            <Horse id='fwefwef' color='black' type='auto' direction='change' />
          </div>
          <div className='flex w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceLineBg})` }}>
            <Horse id='dsfsdfds' color='brown' />
          </div>

          <div className='flex w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceLineBg})` }}>
            <Horse id='dsfsdfasddsad' color='darkbrown' />
          </div>

          <div className='flex w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceLineBg})` }}>
            <Horse id='dsfsdafasdfasdfasdfasd' color='gray' />
          </div>

          <div className='flex w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceLineBg})` }}>
            <Horse id='fsdfdsfdsfdsf' color='lightbrown' />
          </div>
          <div className='flex w-full bg-cover bg-no-repeat' style={{ backgroundImage: `url(${raceLineBg})` }}>
            <Horse id='fsdfasdfsdafasdfasdfasdfsda' color='black' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Race;
