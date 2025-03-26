import { priceHistoryMockData } from '@/mocks/datas/trading';
import { ApiResponseType } from '@/types/service';
import { PriceHistoryType } from '@/types/trading';
import { http, HttpResponse, RequestHandler, StrictResponse } from 'msw';

const priceHistoryHandler = (): StrictResponse<ApiResponseType<PriceHistoryType[]>> => {
  return HttpResponse.json({
    errorCode: null,
    data: priceHistoryMockData,
  });
};

export const handlers: RequestHandler[] = [http.get('/api/v1/horses/:horseId/price-history', priceHistoryHandler)];
