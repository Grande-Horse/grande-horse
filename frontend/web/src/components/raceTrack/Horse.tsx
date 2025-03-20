import BLACK from '@/assets/images/spritesheets/BLACK_HORSE.png';
import BROWN from '@/assets/images/spritesheets/BROWN_HORSE.png';
import DARKBROWN from '@/assets/images/spritesheets/DARKBROWN_HORSE.png';
import GRAY from '@/assets/images/spritesheets/GRAY_HORSE.png';
import LIGHTBROWN from '@/assets/images/spritesheets/LIGHTBROWN_HORSE.png';

interface HorseProps {
  color: 'black' | 'brown' | 'gray' | 'lightbrown' | 'darkbrown';
  id: string;
}

const colorMap = {
  black: BLACK,
  brown: BROWN,
  gray: GRAY,
  lightbrown: LIGHTBROWN,
  darkbrown: DARKBROWN,
};

const Horse: React.FC<HorseProps> = ({ color, id }) => {
  const img = new Image();
  img.src = colorMap[color];

  img.onload = () => {
    init();
  };

  const init = () => {
    const canvas = document.getElementById(id)! as HTMLCanvasElement;
    canvas.width = 78;
    canvas.height = 88;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, 78, 88, -2, 0, 78, 88);
  };

  return (
    <div className='flex items-center justify-center p-2'>
      <canvas id={id} className='size-32 w-full'></canvas>
    </div>
  );
};

export default Horse;
