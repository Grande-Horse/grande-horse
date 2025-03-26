export interface RoomData {
  id: number;
  title: string;
  rank: 'normal' | 'rare' | 'epic' | 'unique' | 'legend';
  batting: number;
  players: number;
  maxPlayers: number;
}
