export interface RaceRecordType {
  totalFirstPlaces: number;
  totalSecondPlaces: number;
  totalThirdPlaces: number;
  totalRaces?: number;
  totalPrize?: number;
}

export interface RaceResultType {
  prize: number;
  userName: string;
  horseName: string;
  coin: number;
  time: number;
}
