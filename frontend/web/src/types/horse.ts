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