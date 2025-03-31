import { PriceHistoryType, TradingItemType } from '@/types/trading';

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
  registeredAt: '2025-03-27',
  soldAt: '2025-03-27',
};

export const tradingListMockData: TradingItemType[] = Array.from({ length: 200 }, () => tradingItemMockData);

export const priceHistoryMockData: PriceHistoryType[] = [
  {
    date: '3.17',
    averagePrice: 120,
    highestPrice: 160,
    lowestPrice: 110,
  },
  {
    date: '3.18',
    averagePrice: 120,
    highestPrice: 160,
    lowestPrice: 110,
  },
  {
    date: '3.19',
    averagePrice: 70,
    highestPrice: 80,
    lowestPrice: 70,
  },
  {
    date: '3.20',
    averagePrice: 120,
    highestPrice: 150,
    lowestPrice: 100,
  },
  {
    date: '3.21',
    averagePrice: 80,
    highestPrice: 90,
    lowestPrice: 60,
  },
  {
    date: '3.22',
    averagePrice: 130,
    highestPrice: 160,
    lowestPrice: 110,
  },
  {
    date: '3.23',
    averagePrice: 120,
    highestPrice: 140,
    lowestPrice: 110,
  },
];
