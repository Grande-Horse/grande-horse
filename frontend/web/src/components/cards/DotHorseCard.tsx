import Horse from '@/components/racetrack/Horse';
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

  return (
    <div
      className={`${bgImageClass[horseRank]} ${rankTextColor[horseRank]} text-stroke flex aspect-square w-full flex-col items-center justify-between rounded-2xl bg-cover bg-center px-4 py-6`}
    >
      <p className='text-heading4 flex w-full items-center justify-center rounded-xl shadow-inner shadow-black/20'>
        {name}
      </p>
      <Horse color={coatColor} id={id} />
    </div>
  );
};

export default DotHorseCard;
