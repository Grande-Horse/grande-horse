import React from 'react';
import '@/components/pastureHorse/horseRun.css';
import { PastureHorsePropsType } from '@/types/horse';

const positionMap: Record<string, string> = {
  D: '0 -8px',
  U: '0 -88px',
  R: '2px -168px',
  L: '1px -168px',
};

export const PastureHorse: React.FC<PastureHorsePropsType> = ({ position, direction, status, onClick, imageSize }) => {
  const dynamicStyle = {
    top: `${position.y * imageSize.y}px`,
    left: `${position.x * imageSize.x}px`,
    width: `${imageSize.x}px`,
    height: `${imageSize.y}px`,
    transition: `top ${10 / status.velocity}s, left ${10 / status.velocity}s`,
    background: "url('src/assets/images/spritesheets/uniqueHorse.png') no-repeat 0 0 / auto",
    backgroundPosition: positionMap[direction],
    transform: direction === 'L' ? 'scaleX(-1)' : 'none',
    filter: status.isSelected
      ? 'drop-shadow(1px 1px white) drop-shadow(1px -1px white) drop-shadow(-1px 1px white) drop-shadow(-1px -1px white)'
      : 'none',
  };

  return (
    <div
      className={`absolute cursor-pointer ${status.isMoving ? 'horse moving' : ''}`}
      style={dynamicStyle}
      onTransitionStart={(e: React.SyntheticEvent<HTMLDivElement>) => {
        status.isMoving = true;
        e.currentTarget.classList.add('moving');
        e.currentTarget.style.animation = `horseRun ${5 / status.velocity}s steps(7) infinite`;
      }}
      onTransitionEnd={(e: React.SyntheticEvent<HTMLDivElement>) => {
        status.isMoving = false;
        e.currentTarget.classList.remove('moving');
        e.currentTarget.style.animation = 'none';
      }}
      onClick={onClick}
    />
  );
};
