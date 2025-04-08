import { HorseType } from '@/types/horse';

export interface PriceHistoryType {
  date: string;
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
}

export interface TradingItemType extends HorseType {
  tradeId: number;
  price: number;
}

export interface RegisteredItemType extends TradingItemType {
  registeredAt: string;
}

export interface SoldItemType extends TradingItemType {
  soldAt: string;
}
