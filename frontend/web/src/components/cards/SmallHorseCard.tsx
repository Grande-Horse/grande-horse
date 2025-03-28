import { HorseType } from '@/types/horse';
import RankIcon from '@/assets/icons/rankIcon.svg?react';
import WeightIcon from '@/assets/icons/weightIcon.svg?react';
import SpeedIcon from '@/assets/icons/speedIcon.svg?react';
import AccelerationIcon from '@/assets/icons/accelerationIcon.svg?react';
import StaminaIcon from '@/assets/icons/staminaIcon.svg?react';
import Ribbon from '@/assets/images/ribbon.webp';
import { getDynamicImgSrc } from '@/utils/image';
import { RankMap } from '@/constants/horse';

interface SmallHorseCardProps {
  horse: HorseType;
}

const SmallHorseCard: React.FC<SmallHorseCardProps> = ({
  horse: { name, coatColor, rank, weight, speed, acceleration, stamina },
}) => {
  const horseStats = [
    {
      icon: <RankIcon width={10} height={10} />,
      label: '등급',
      value: RankMap[rank as keyof typeof RankMap],
    },
    { icon: <WeightIcon width={10} height={10} />, label: '체중', value: weight + 'kg' },
    { icon: <SpeedIcon width={10} height={10} />, label: '속도', value: speed + 'km/h' },
    { icon: <AccelerationIcon width={10} height={10} />, label: '가속도', value: acceleration + 'km/s' },
    { icon: <StaminaIcon width={10} height={10} />, label: '지구력', value: stamina + '%' },
  ];

  const horseImageSrc = getDynamicImgSrc('horses', coatColor + 'Horse');

  return (
    <div>
      <div
        className={`${cardImageClass[rank as keyof typeof cardImageClass]} relative flex aspect-[320/492] w-[11rem] flex-col items-center justify-between bg-contain bg-center bg-no-repeat pt-5 pb-6.5`}
      >
        <p className='text-detail3 text-stroke absolute top-5.5 z-2'>{name}</p>
        <img src={Ribbon} alt='ribbon' className='absolute top-4 z-1' />
        <div
          className={`${bgImageClass[rank as keyof typeof bgImageClass]} relative aspect-[256/270] w-[8rem] bg-cover`}
        >
          <img src={horseImageSrc} className='absolute bottom-0' />
        </div>

        <ul className='flex w-full flex-col px-7.5'>
          {horseStats.map((stat) => (
            <li key={stat.label} className='flex items-center justify-between'>
              <div className='flex items-center'>
                <span>{stat.icon}</span>
                <p className='text-detail4 text-black'>{stat.label}</p>
              </div>
              <p className='text-detail4 text-black'>{stat.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SmallHorseCard;

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
