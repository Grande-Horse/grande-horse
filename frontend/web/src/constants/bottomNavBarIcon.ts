import PastureIcon from '@/assets/icons/pastureIcon.svg?react';
import StallIcon from '@/assets/icons/stallIcon.svg?react';
import RacetrackIcon from '@/assets/icons/racetrackIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';

export const bottomNavBarItem = [
  { icon: PastureIcon, text: '목장', pathname: '/' },
  { icon: StallIcon, text: '마구간', pathname: '/stall' },
  { icon: RacetrackIcon, text: '경마장', pathname: 'racetrack' },
  { icon: HorseDealIcon, text: '마시장', pathname: '/market' },
] as const;
