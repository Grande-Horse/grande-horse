import { HorseCardType } from '@/types/card';
import { HorseType } from '@/types/horse';

export const horseMockData: HorseType = {
  horseId: '1',
  name: '굿필승',
  coatColor: 'gray',
  horseRank: 'epic',
  weight: 100,
  speed: 100,
  acceleration: 220,
  stamina: 160,
};

export const horseCardMockData: HorseCardType = {
  ...horseMockData,
  cardId: 2,
  status: 0,
};

export const horseListMockData: HorseType[] = Array.from({ length: 22 }, () => horseMockData);
export const horseCardListMockData: HorseCardType[] = Array.from({ length: 82 }, () => horseCardMockData);
