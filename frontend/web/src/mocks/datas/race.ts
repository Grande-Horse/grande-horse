import { RaceRecordType, RaceResultType } from '@/types/race';

export const raceRecordMockData: RaceRecordType = {
  totalFirstPlaces: 24,
  totalSecondPlaces: 18,
  totalThirdPlaces: 20,
};

export const raceResultListMockData: RaceResultType[] = [
  { prize: 1, userName: '박경범', horseName: '굿필승', coin: 500, time: 6 },
  { prize: 2, userName: '김서로', horseName: '굿모닝', coin: 300, time: 7 },
  { prize: 3, userName: '신성우', horseName: '굿이브닝', coin: 100, time: 8 },
  { prize: 4, userName: '오상하', horseName: '굿애프너눈', coin: 0, time: 10 },
  { prize: 5, userName: '이지운', horseName: '굿바이', coin: 0, time: 20 },
  { prize: 6, userName: '우성문', horseName: '굿보이', coin: 0, time: 21 },
];
