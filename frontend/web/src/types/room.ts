import { RankType } from '@/types/horse';

export interface RoomData {
  roomId?: number;
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
