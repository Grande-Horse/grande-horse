import { PriceHistoryType } from '@/types/trading';

export const isExistPriceHistory = (priceHistoryList: PriceHistoryType[]) => {
  return priceHistoryList.some(
    (history) => history.averagePrice !== 0 || history.highestPrice !== 0 || history.lowestPrice !== 0
  );
};
