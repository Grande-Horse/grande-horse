import { apiGet, apiPost } from '@/services/apiService';
import { PayConfirmInfoType, PayInitInfoType } from '@/types/pay';

export const initCashPay = async (coinId: number): Promise<PayInitInfoType> => {
  const body = { id: coinId };
  return apiPost<{ id: number }, PayInitInfoType>('/purchases/coin/cash/init', body);
};

export const confirmCashPay = async (payConfirmInfo: PayConfirmInfoType) => {
  apiPost<PayConfirmInfoType, null>('/purchases/coin/cash/confirm', payConfirmInfo);
};

export const getMyCoin = async (): Promise<{ coin: number }> => {
  return apiGet<{ coin: number }>('/users/coin');
};
