import { HorseType } from '@/types/horse';

export const horseMockData: HorseType = {
  id: '1',
  name: '굿필승',
  coatColor: 'gray',
  horseRank: 'epic',
  weight: 100,
  speed: 100,
  acceleration: 220,
  stamina: 160,
};

export const horseListMockData: HorseType[] = Array.from({ length: 22 }, () => horseMockData);
