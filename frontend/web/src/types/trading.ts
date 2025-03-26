export interface PriceHistoryType {
  date: string;
  averagePrice: number | null;
  highestPrice: number | null;
  lowestPrice: number | null;
}

export interface SellHorseType {
  horseId: string;
  cardId: number;
  sellerId: number;
  price: number;
}
