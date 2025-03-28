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

export interface PastureHorsePositionType {
  x: number;
  y: number;
}

export interface PastureHorseStatusType {
  isSelected: boolean;
  isMoving: boolean;
  velocity: number;
}

export interface PastureHorsePropsType {
  position: PastureHorsePositionType;
  direction: string;
  status: PastureHorseStatusType;
  onClick?: () => void;
  imageSize: {
    x: number;
    y: number;
  };
}
