import { apiPost } from '@/services/apiService';
import { PayConfirmInfoType, PayInitInfoType } from '@/types/pay';

export const initCashPay = async (coinId: number): Promise<PayInitInfoType> => {
  const body = { id: coinId };
  return apiPost<{ id: number }, PayInitInfoType>('/products/coin/cash/init', body);
};

export const confirmCashPay = async (payConfirmInfo: PayConfirmInfoType) => {
  apiPost<PayConfirmInfoType, null>('/products/coin/cash/confirm', payConfirmInfo);
};
