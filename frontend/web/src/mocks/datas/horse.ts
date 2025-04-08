import { HorseCardType } from '@/types/card';
import { HorseType } from '@/types/horse';

export const horseMockData: HorseType = {
  horseId: '1',
  name: '굿필승',
  coatColor: 'gray',
  horseRank: 'rare',
  weight: 150,
  speed: 100,
  acceleration: 120,
  stamina: 100,
};

export const horseCardMockData: HorseCardType = {
  ...horseMockData,
  cardId: 1,
  status: 0,
};

export const horseListMockData: HorseType[] = Array.from({ length: 22 }, () => horseMockData);
export const horseCardListMockData: HorseCardType[] = Array.from({ length: 82 }, () => horseCardMockData);

export const horseCardListMockData2: HorseCardType[] = [
  horseCardMockData,
  {
    horseId: '2',
    name: '굿굿필승',
    coatColor: 'brown',
    horseRank: 'normal',
    weight: 150,
    speed: 100,
    acceleration: 120,
    stamina: 100,
    cardId: 2,
    status: 0,
  },
  {
    horseId: '3',
    name: '굿바이',
    coatColor: 'lightbrown',
    horseRank: 'epic',
    weight: 150,
    speed: 100,
    acceleration: 120,
    stamina: 100,
    cardId: 3,
    status: 0,
  },
  {
    horseId: '4',
    name: '굿모닝',
    coatColor: 'darkbrown',
    horseRank: 'unique',
    weight: 150,
    speed: 100,
    acceleration: 120,
    stamina: 100,
    cardId: 4,
    status: 0,
  },
  {
    horseId: '5',
    name: '굿이브닝',
    coatColor: 'black',
    horseRank: 'legend',
    weight: 150,
    speed: 100,
    acceleration: 120,
    stamina: 100,
    cardId: 5,
    status: 0,
  },
];
