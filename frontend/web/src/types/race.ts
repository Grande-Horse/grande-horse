import { RoomJoinUserData } from './room';

export interface RaceRecordType {
  totalFirstPlaces: number;
  totalSecondPlaces: number;
  totalThirdPlaces: number;
  totalRaces?: number;
  totalPrize?: number;
}

export interface RaceUser {
  userId: number;
  distance: number;
}

export interface GameResult {
  userNickname: string;
  totalPrize: number;
  raceRank: number;
  userId: number;
}

export interface ProgressData {
  type: 'progressData';
  progress: RaceUser[];
}

export interface ResultData {
  type: 'resultData';
  roomId: number;
  roomName: string;
  gameResult: GameResult[];
  playersInfo: RoomJoinUserData[];
  maxPlayers: number;
}

export type GameData = ProgressData | ResultData;
