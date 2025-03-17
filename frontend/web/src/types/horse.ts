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

export const RankMap = {
  normal: '노멀',
  rare: '레어',
  epic: '에픽',
  unique: '유니크',
  legend: '레전드',
} as const;

export type RankType = (typeof RankMap)[keyof typeof RankMap];

export type CoatColorType = 'black' | 'white' | 'brown' | 'darkbrown' | 'gray';
