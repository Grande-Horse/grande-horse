export interface TabType<T> {
  tabId: number;
  tabName: T;
}

export type StableTabNameType = '관리' | '능력치' | '합성';

export type MarketTabNameType = '카드팩' | '코인' | '거래';

export type sellTabNameType = '변동 시세' | '거래 내역';
