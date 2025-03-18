export interface RoomData {
  id: number;
  title: string;
  rank: 'common' | 'rare' | 'epic' | 'unique' | 'legend';
  batting: number;
  players: number;
  maxPlayers: number;
}
