import Gross from '@/assets/icons/grassIcon.svg?react';
import Stall from '@/assets/icons/stallIcon.svg?react';
import Racetrack from '@/assets/icons/racetrackIcon.svg?react';
import HorseDeal from '@/assets/icons/horseDealIcon.svg?react';
import HorseManagement from '@/assets/icons/horseManagementIcon.svg?react';
import HorseStatus from '@/assets/icons/horseStatusIcon.svg?react';
import HorseMix from '@/assets/icons/horseMixIcon.svg?react';
import CardPack from '@/assets/icons/cardPackIcon.svg?react';
import Coin from '@/assets/icons/coinIcon.svg?react';

export const bottomNavBarIcon = {
  default: [
    { icon: Gross, text: '목장' },
    { icon: Stall, text: '마구간' },
    { icon: Racetrack, text: '경마장' },
    { icon: HorseDeal, text: '마시장' },
  ],
  stall: [
    { icon: HorseManagement, text: '관리' },
    { icon: HorseStatus, text: '능력치' },
    { icon: HorseMix, text: '합성' },
  ],
  horseDeal: [
    { icon: CardPack, text: '카드팩' },
    { icon: Coin, text: '코인' },
    { icon: HorseDeal, text: '거래' },
  ],
} as const;
