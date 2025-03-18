import { RankMap } from '@/constants/horse';

export interface HorseType {
  id: string;
  name: string;
  coatColor: CoatColorType;
  rank: keyof typeof RankMap;
  weight: number;
  speed: number;
  acceleration: number;
  stamina: number;
}

export type RankType = (typeof RankMap)[keyof typeof RankMap];

export type CoatColorType = 'black' | 'white' | 'brown' | 'darkbrown' | 'gray';
