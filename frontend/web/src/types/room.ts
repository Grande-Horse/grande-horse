import { CoatColorType, RankType } from '@/types/horse';

export interface RoomData {
  roomId: number;
  roomName: string;
  rankRestriction: RankType | '';
  bettingCoin: number;
  currentPlayers?: number;
  maxPlayers: number;
}

export interface RoomCreateData {
  roomName: string;
  rankRestriction: RankType | '';
  bettingCoin: number;
  maxPlayers: number;
}

export interface RoomJoinUserData {
  userId: number;
  horseColor: CoatColorType;
  horseName: string;
  horseRank: 'normal' | 'rare' | 'epic' | 'unique' | 'legend';
  ready: boolean;
  roomOwner: boolean;
  userNickname: string;
}
