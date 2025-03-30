export interface SellHorseRequest {
  horseId: string;
  cardId: number;
  sellerId: number;
  price: number;
}

export interface CursorRequest {
  cursorId: number;
  limit: number;
}
