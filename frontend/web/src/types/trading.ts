import { HorseCardType } from '@/types/card';

export interface PriceHistoryType {
  date: string;
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
}

export interface TradingItemType extends HorseCardType {
  tradeId: number;
  price: number;
}

export interface RegisteredItemType extends TradingItemType {
  registeredAt: string;
}

export interface SoldItemType extends TradingItemType {
  soldAt: string;
}
