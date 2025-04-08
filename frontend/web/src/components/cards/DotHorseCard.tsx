import { rankTextColor } from '@/constants/rank';
import { CoatColorType, RankType } from '@/types/horse';

interface DotHorseCardProps {
  id: string;
  name: string;
  coatColor: CoatColorType;
  horseRank: RankType;
}

const DotHorseCard: React.FC<DotHorseCardProps> = ({ id, name, coatColor, horseRank }) => {
  const bgImageClass = {
    normal: `bg-[url(@/assets/images/backgrounds/normalBg.webp)]`,
    rare: `bg-[url(@/assets/images/backgrounds/rareBg.webp)]`,
    epic: `bg-[url(@/assets/images/backgrounds/epicBg.webp)]`,
    unique: `bg-[url(@/assets/images/backgrounds/uniqueBg.webp)]`,
    legend: `bg-[url(@/assets/images/backgrounds/legendBg.webp)]`,
  } as const;

  const horseImageClass = {
    black: `bg-[url(@/assets/images/spritesheets/black.png)]`,
    gray: `bg-[url(@/assets/images/spritesheets/gray.png)]`,
    brown: `bg-[url(@/assets/images/spritesheets/brown.png)]`,
    lightbrown: `bg-[url(@/assets/images/spritesheets/lightbrown.png)]`,
    darkbrown: `bg-[url(@/assets/images/spritesheets/darkbrown.png)]`,
  } as const;

  return (
    <div
      className={`${bgImageClass[horseRank]} ${rankTextColor[horseRank]} text-stroke flex aspect-square h-full w-full flex-col items-center justify-between rounded-2xl bg-cover bg-center px-4 py-6 pb-12`}
    >
      <p className='text-heading4 flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
        {name}
      </p>
      <div className={`horseIdle-right image-rendering-pixelated scale-200 ${horseImageClass[coatColor]}`}></div>
    </div>
  );
};

export default DotHorseCard;
