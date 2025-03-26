import { MarketTabNameType, sellTabNameType, StableTabNameType, TabType } from '@/types/tabList';

export const stableTabList: TabType<StableTabNameType>[] = [
  { tabId: 0, tabName: '관리' },
  { tabId: 1, tabName: '능력치' },
  { tabId: 2, tabName: '합성' },
];

export const marketTabList: TabType<MarketTabNameType>[] = [
  { tabId: 0, tabName: '카드팩' },
  { tabId: 1, tabName: '코인' },
  { tabId: 2, tabName: '거래' },
];

export const sellTabList: TabType<sellTabNameType>[] = [
  { tabId: 0, tabName: '변동 시세' },
  { tabId: 1, tabName: '거래 내역' },
];
