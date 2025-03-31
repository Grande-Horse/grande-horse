import { RankType } from '@/types/horse';

export interface RoomData {
  id?: number;
  title: string;
  rank: RankType | '';
  batting: number;
  players?: number;
  maxPlayers: number;
}
