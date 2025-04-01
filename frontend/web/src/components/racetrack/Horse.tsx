import { useEffect, useRef, useState } from 'react';

import BLACK from '@/assets/images/spritesheets/BLACK_HORSE.png';
import BROWN from '@/assets/images/spritesheets/BROWN_HORSE.png';
import DARKBROWN from '@/assets/images/spritesheets/DARKBROWN_HORSE.png';
import GRAY from '@/assets/images/spritesheets/GRAY_HORSE.png';
import LIGHTBROWN from '@/assets/images/spritesheets/LIGHTBROWN_HORSE.png';

type CoatColorType = 'black' | 'lightbrown' | 'brown' | 'darkbrown' | 'gray';

interface HorseProps {
  color: CoatColorType;
  id: string;
  direction?: string;
  type?: 'passivity' | 'auto';
}

const colorMap = {
  black: BLACK,
  brown: BROWN,
  gray: GRAY,
  lightbrown: LIGHTBROWN,
  darkbrown: DARKBROWN,
};

const FRAME_RATE = 150;

const Horse: React.FC<HorseProps> = ({ color, direction = 'waiting', type = 'passivity' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIndex = useRef(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isAnimating = useRef(false);
  const animationTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isMobileAnimating, setIsMobileAnimating] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = colorMap[color];
    imgRef.current = img;

    img.onload = () => {
      drawFrame(0);
    };
  }, [color]);

  const drawFrame = (frame: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx || !imgRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const spriteX = frame * 78;
    const spriteY = direction === 'change' ? 167 : 0;

    ctx.drawImage(imgRef.current, spriteX, spriteY, 78, 88, 0, 0, 78, 88);
  };

  const startAnimation = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const animate = () => {
      drawFrame(frameIndex.current);
      frameIndex.current = (frameIndex.current + 1) % 7;

      if (isAnimating.current) {
        animationTimeout.current = setTimeout(animate, FRAME_RATE);
      }
    };

    animate();
  };

  const stopAnimation = () => {
    isAnimating.current = false;
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
      animationTimeout.current = null;
    }
    drawFrame(0);
  };

  const handleTouch = () => {
    if (isMobileAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
    setIsMobileAnimating(!isMobileAnimating);
  };

  if (type === 'auto') startAnimation();

  return (
    <div
      className='flex items-center justify-center p-2'
      onMouseEnter={type !== 'auto' && direction === 'change' ? startAnimation : undefined}
      onMouseLeave={type !== 'auto' && direction === 'change' ? stopAnimation : undefined}
      onTouchStart={type !== 'auto' && direction === 'change' ? handleTouch : undefined}
    >
      <canvas ref={canvasRef} width={78} height={88} className='size-32 w-full'></canvas>
    </div>
  );
};

export default Horse;
