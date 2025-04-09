import { rankMap } from '@/constants/rank';

export interface HorseType {
  horseId: string;
  name: string;
  coatColor: CoatColorType;
  horseRank: RankType;
  weight: number;
  speed: number;
  acceleration: number;
  stamina: number;
}

export type RankType = keyof typeof rankMap;
export type RankKrType = (typeof rankMap)[keyof typeof rankMap];

export type CoatColorType = 'black' | 'brown' | 'gray' | 'darkbrown' | 'lightbrown';

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
  horse: HorseType;
  position: PastureHorsePositionType;
  direction: string;
  status: PastureHorseStatusType;
  onClick?: () => void;
  imageSize: {
    x: number;
    y: number;
  };
}


export interface CandidateHorseType {
  cardId: number;
  horseId: string;
  status: number;
  coatColor: CoatColorType;
  name: string;
  horseRank: RankType;
  weight: number;
  speed: number;
  acceleration: number;
  stamina: number;
}

