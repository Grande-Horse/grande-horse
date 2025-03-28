import { priceHistoryMockData } from '@/mocks/datas/trading';
import { ApiResponse, CursorData } from '@/types/service/response';
import { PriceHistoryType, RegisteredItemType } from '@/types/trading';
import { http, HttpResponse, RequestHandler, StrictResponse } from 'msw';

// const AllHorsetrading = ({ request }): Promise<StrictResponse<ApiResponse<CursorData<RegisteredItemType>>>> => {

//   return HttpResponse.json({
//     items,
//     hasNextItems,
//     nextCursorId,
//   });
// };

const priceHistoryHandler = (): StrictResponse<ApiResponse<PriceHistoryType[]>> => {
  return HttpResponse.json({
    errorCode: null,
    data: priceHistoryMockData,
  });
};

const sellHorseHandler = (): StrictResponse<ApiResponse<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const purchaseHorseHandler = (): StrictResponse<ApiResponse<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const cancelHorseSellingHandler = (): StrictResponse<ApiResponse<null>> => {
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
