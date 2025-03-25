import { CoatColorType, RankType } from '@/types/horse';
import Ribbon from '@/assets/images/ribbon.webp';
import { getDynamicImgSrc } from '@/utils/image';

interface HorseProfileCardProps {
  name: string;
  rank: RankType;
  coatColor: CoatColorType;
}

const HorseProfileCard: React.FC<HorseProfileCardProps> = ({ name, rank, coatColor }) => {
  const horseImageSrc = getDynamicImgSrc('horses', coatColor + 'Horse');

  return (
    <div className='relative flex w-[18rem] justify-center'>
      <p className='text-body2 text-stroke absolute top-0.5 z-2'>{name}</p>
      <img src={Ribbon} alt='ribbon' className='absolute top-[-4px] z-1' />
      <div
        className={`${bgImageClass[rank as keyof typeof bgImageClass]} relative aspect-[256/270] w-[14rem] bg-cover`}
      >
        <img src={horseImageSrc} className='absolute bottom-0' />
      </div>
    </div>
  );
};

export default HorseProfileCard;

const bgImageClass = {
  normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
  rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
  epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
  unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
  legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
} as const;
