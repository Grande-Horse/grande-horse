import { PriceHistoryType } from '@/types/trading';

/**
 * 최근 일주일 간 거래 내역이 존재하는지 여부 반환
 */
export const isExistPriceHistory = (priceHistoryList: PriceHistoryType[]) => {
  return priceHistoryList.some(
    (history) => history.averagePrice !== 0 || history.highestPrice !== 0 || history.lowestPrice !== 0
  );
};

/**
 * 최근 일주일 간의 최고값 반환
 */
export const getHighestPrice = (priceHistoryList: PriceHistoryType[]): number => {
  if (isExistPriceHistory(priceHistoryList)) return 0;

  return Math.max(...priceHistoryList.map((history) => history.highestPrice));
};

/**
 * 최근 일주일 간의 최저값 반환
 */
export const getLowestPrice = (priceHistoryList: PriceHistoryType[]): number => {
  if (isExistPriceHistory(priceHistoryList)) return 0;

  return Math.min(...priceHistoryList.map((history) => history.lowestPrice));
};

/**
 * 최근 일주일 간의 평균값 반환
 */
export const getAveragePrice = (priceHistoryList: PriceHistoryType[]): number => {
  if (isExistPriceHistory(priceHistoryList)) return 0;

  const total = priceHistoryList.reduce((sum, history) => sum + history.averagePrice, 0);
  return total / priceHistoryList.length;
};
