import React from 'react';
import raceTopBg from '@/assets/images/backgrounds/raceTopBg.webp';
import raceLineBg from '@/assets/images/backgrounds/raceLineBg.webp';
import Horse from '@/components/racetrack/Horse';
import type UserInfoData from '@/types/user';
import { RoomJoinUserData } from '@/types/room';

interface RaceUser {
  userId: number;
  distance: number;
}

interface RaceProps {
  info: RaceUser[];
  user: UserInfoData | undefined | null;
  players: RoomJoinUserData[];
}

const Race: React.FC<RaceProps> = ({ user, info, players }) => {
  const MAX_DISTANCE = 2030;
  const TRACK_WIDTH = 2060;
  const VIEWPORT_WIDTH = window.innerWidth;
  const pxPerDistance = TRACK_WIDTH / MAX_DISTANCE;

  const myHorseDistance = info.find((i) => i.userId === user?.id)?.distance || 0;
  const myHorseX = myHorseDistance * pxPerDistance;

  const cameraTranslateX = Math.min(0, Math.max(VIEWPORT_WIDTH - TRACK_WIDTH, -myHorseX));

  const backgroundProgress = Math.min(myHorseX / TRACK_WIDTH, 1);
  const backgroundPositionX = `${backgroundProgress * 100}%`;

  return (
    <div className='flex h-full w-full flex-col justify-center overflow-hidden bg-[#55da54]'>
      <div className='relative h-60 w-full overflow-hidden bg-[#55da54]'>
        <div
          className='absolute top-0 left-0 h-full min-w-[2060px] bg-cover bg-no-repeat'
          style={{
            backgroundImage: `url(${raceTopBg})`,
            transform: `translateX(-${backgroundProgress * (TRACK_WIDTH - window.innerWidth)}px)`,
            transition: 'transform 1s ease-out',
          }}
        />
      </div>

      <div className='relative h-full w-full overflow-hidden'>
        <div
          className='absolute top-0 left-0 flex h-full min-w-[2060px] flex-col items-center justify-evenly'
          style={{
            transform: `translateX(${cameraTranslateX}px)`,
            transition: 'transform 1s ease-out',
          }}
        >
          {players.map((player) => {
            const isMine = player.userId === user?.id;
            const distance = info.find((i) => i.userId === player.userId)?.distance || 0;
            const horseX = distance * pxPerDistance;

            return (
              <div key={player.userId} className='relative flex h-36 w-full'>
                <div
                  className='absolute top-0 left-0 h-full w-full'
                  style={{
                    backgroundImage: `url(${raceLineBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: `${backgroundPositionX} 0`,
                    transition: 'background-position 1s ease-out',
                  }}
                />
                <div
                  className='absolute top-0 flex flex-col items-center'
                  style={{
                    left: `${horseX}px`,
                    transition: 'left 1s ease-out',
                  }}
                >
                  {isMine && (
                    <div className='absolute -top-10 flex flex-col items-center justify-center'>
                      <div className='text-stroke'>{player.userNickname}</div>
                      <div className='triangle-down'></div>
                    </div>
                  )}
                  <Horse color={player.horseColor} direction='right' state='run' />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Race;
