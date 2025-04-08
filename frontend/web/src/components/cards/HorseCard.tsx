import { HorseType } from '@/types/horse';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';
import Ribbon from '@/assets/images/ribbon.webp';
import { getDynamicImgSrc } from '@/utils/image';
import { rankMap } from '@/constants/rank';

interface HorseCardProps {
  horse: HorseType;
}

const HorseCard: React.FC<HorseCardProps> = ({
  horse: { name, coatColor, horseRank: rank, weight, speed, acceleration, stamina },
}) => {
  const horseStats = [
    {
      icon: <RankIcon />,
      label: '등급',
      value: rankMap[rank as keyof typeof rankMap],
    },
    { icon: <WeightIcon />, label: '체중', value: weight + 'kg' },
    { icon: <SpeedIcon />, label: '속도', value: speed + 'km/h' },
    { icon: <AccelerationIcon />, label: '가속도', value: acceleration + 'km/h' },
    { icon: <StaminaIcon />, label: '지구력', value: stamina + '%' },
  ];

  const horseImageSrc = getDynamicImgSrc('horses', coatColor + 'Horse');

  return (
    <div>
      <div
        className={`${cardImageClass[rank as keyof typeof cardImageClass]} relative flex aspect-[320/492] w-[34.2rem] flex-col items-center justify-between bg-contain bg-center bg-no-repeat pt-14`}
      >
        <p className='text-heading4 text-stroke absolute top-17 z-2'>{name}</p>
        <img src={Ribbon} alt='ribbon' className='absolute top-10 z-1' />
        <div
          className={`${bgImageClass[rank as keyof typeof bgImageClass]} relative aspect-[256/270] w-[25.6rem] bg-cover`}
        >
          <img src={horseImageSrc} className='absolute bottom-0' />
        </div>

        <ul className='flex w-full flex-col gap-2 pr-24 pb-22 pl-22'>
          {horseStats.map((stat) => (
            <li key={stat.label} className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span>{stat.icon}</span>
                <p className='text-black'>{stat.label}</p>
              </div>
              <p className='text-stroke'>{stat.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HorseCard;

const cardImageClass = {
  normal: `bg-[url(@/assets/images/cards/normalCard.webp)]`,
  rare: `bg-[url(@/assets/images/cards/rareCard.webp)]`,
  epic: `bg-[url(@/assets/images/cards/epicCard.webp)]`,
  unique: `bg-[url(@/assets/images/cards/uniqueCard.webp)]`,
  legend: `bg-[url(@/assets/images/cards/legendCard.webp)]`,
} as const;

const bgImageClass = {
  normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
  rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
  epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
  unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
  legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
} as const;
