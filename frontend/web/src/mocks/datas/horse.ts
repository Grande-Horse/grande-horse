import { HorseType } from '@/types/horse';
import { RegisteredItemType, TradingItemType } from '@/types/trading';

export const horseMockData: HorseType = {
  id: '1',
  name: '굿필승',
  coatColor: 'gray',
  rank: 'epic',
  weight: 100,
  speed: 100,
  acceleration: 220,
  stamina: 160,
};

export const tradingItemMockData: TradingItemType = {
  id: '1',
  name: '굿필승',
  coatColor: 'gray',
  rank: 'epic',
  weight: 100,
  speed: 100,
  acceleration: 220,
  stamina: 160,
  tradeId: 1,
  price: 500,
};

export const RegisteredItemMockData: RegisteredItemType = {
  ...tradingItemMockData,
  registeredAt: '2025-03-27',
};

export const horseListMockData: HorseType[] = Array.from({ length: 22 }, () => horseMockData);
export const RegisteredListMockData: RegisteredItemType[] = Array.from({ length: 200 }, () => RegisteredItemMockData);
