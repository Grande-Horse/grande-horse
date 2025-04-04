import { RankType } from '@/types/horse';

export const myCoin = {
  coin: 1000,
} as const;

type CoatColorType = 'black' | 'lightbrown' | 'brown' | 'darkbrown' | 'gray';
// api 연동전에 임시 타입
interface User {
  id: number;
  userName: string;
  isReady: boolean;
  coatColor: CoatColorType;
  rank: RankType;
}

export const userMockData: User[] = [
  {
    id: 1,
    userName: '굿필승',
    isReady: true,
    coatColor: 'black',
    rank: 'normal',
  },

  {
    id: 2,
    userName: '굿필승',
    isReady: true,
    coatColor: 'lightbrown',
    rank: 'rare',
  },

  {
    id: 3,
    userName: '굿필승',
    isReady: false,
    coatColor: 'brown',
    rank: 'epic',
  },

  {
    id: 4,
    userName: '굿필승',
    isReady: true,
    coatColor: 'darkbrown',
    rank: 'unique',
  },

  // {
  //   id: 5,
  //   userName: '굿필승',
  //   isReady: false,
  //   coatColor: 'gray',
  //   rank: 'legend',
  // },
];
