import PastureIcon from '@/assets/icons/pastureIcon.svg?react';
import StallIcon from '@/assets/icons/stallIcon.svg?react';
import RacetrackIcon from '@/assets/icons/racetrackIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';

export const bottomNavBarIcon = [
  { icon: PastureIcon, text: '목장' },
  { icon: StallIcon, text: '마구간' },
  { icon: RacetrackIcon, text: '경마장' },
  { icon: HorseDealIcon, text: '마시장' },
] as const;
