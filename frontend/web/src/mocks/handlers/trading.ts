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

const sellHorseHandler = (): StrictResponse<ApiResponseType<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const purchaseHorseHandler = (): StrictResponse<ApiResponseType<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const cancelHorseSellingHandler = (): StrictResponse<ApiResponseType<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

export const handlers: RequestHandler[] = [
  http.get('/horses/:horseId/price-history', priceHistoryHandler),
  http.post('/trading', sellHorseHandler),
  http.put('/trading/:tradeId', purchaseHorseHandler),
  http.delete('/trading/:tradeId', cancelHorseSellingHandler),
];
