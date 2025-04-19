import { type RoomCreateData, type RoomData } from '@/types/room';

export const roomCreateResetData: RoomCreateData = {
  roomName: '',
  rankRestriction: '',
  bettingCoin: 0,
  maxPlayers: 1,
};

export const roomListResetData: RoomData[] = [
  { roomId: 0, roomName: '', rankRestriction: '', bettingCoin: 0, currentPlayers: 0, maxPlayers: 1 },
];
