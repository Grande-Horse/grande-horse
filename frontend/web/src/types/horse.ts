import { RankMap } from '@/constants/horse';

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

export type RankType = keyof typeof RankMap;
export type RankKrType = (typeof RankMap)[keyof typeof RankMap];

export type CoatColorType = 'black' | 'white' | 'brown' | 'darkbrown' | 'gray';
