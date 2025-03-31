import { CoatColorType, RankType } from '@/types/horse';
import { getDynamicImgSrc } from '@/utils/image';

interface HorseProfileCardProps {
  name: string;
  rank: RankType;
  coatColor: CoatColorType;
}

const HorseProfileCard: React.FC<HorseProfileCardProps> = ({ name, rank, coatColor }) => {
  const horseImageSrc = getDynamicImgSrc('horses', coatColor + 'Horse');

  return (
    <div className='relative mx-3 flex aspect-square h-full w-full flex-col items-center'>
      <div
        className={`${bgRibbonClass} absolute z-1 flex h-1/3 w-full scale-120 items-center justify-center bg-contain bg-center bg-no-repeat`}
      ></div>
      <p className='text-body2 text-stroke absolute top-0.5 z-2'>{name}</p>
      <div
        className={`${bgImageClass[rank as keyof typeof bgImageClass]} relative h-full w-full bg-contain bg-center bg-no-repeat`}
      >
        <img src={horseImageSrc} className='absolute bottom-0 h-full w-full object-contain pt-8' />
      </div>
    </div>
  );
};

export default HorseProfileCard;

const bgRibbonClass = 'bg-[url(@/assets/images/ribbon.webp)]';

const bgImageClass = {
  normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
  rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
  epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
  unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
  legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
} as const;
