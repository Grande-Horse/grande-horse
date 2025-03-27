import { rankMap } from '@/constants/rank';

export interface HorseType {
  id: string;
  name: string;
  coatColor: CoatColorType;
  rank: RankType;
  weight: number;
  speed: number;
  acceleration: number;
  stamina: number;
}

export type RankType = keyof typeof rankMap;
export type RankKrType = (typeof rankMap)[keyof typeof rankMap];

export type CoatColorType = 'black' | 'white' | 'brown' | 'darkbrown' | 'gray';
