import GrossIcon from '@/assets/icons/grassIcon.svg?react';
import StallIcon from '@/assets/icons/stallIcon.svg?react';
import RacetrackIcon from '@/assets/icons/racetrackIcon.svg?react';
import HorseDealIcon from '@/assets/icons/horseDealIcon.svg?react';
import HorseManagementIcon from '@/assets/icons/horseManagementIcon.svg?react';
import HorseStatusIcon from '@/assets/icons/horseStatusIcon.svg?react';
import HorseMixIcon from '@/assets/icons/horseMixIcon.svg?react';
import CardPackIcon from '@/assets/icons/cardPackIcon.svg?react';
import CoinIcon from '@/assets/icons/coinIcon.svg?react';

export const bottomNavBarIcon = {
  default: [
    { icon: GrossIcon, text: '목장' },
    { icon: StallIcon, text: '마구간' },
    { icon: RacetrackIcon, text: '경마장' },
    { icon: HorseDealIcon, text: '마시장' },
  ],
  stall: [
    { icon: HorseManagementIcon, text: '관리' },
    { icon: HorseStatusIcon, text: '능력치' },
    { icon: HorseMixIcon, text: '합성' },
  ],
  horseDeal: [
    { icon: CardPackIcon, text: '카드팩' },
    { icon: CoinIcon, text: '코인' },
    { icon: HorseDealIcon, text: '거래' },
  ],
} as const;
