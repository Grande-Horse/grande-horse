import { CURSOR_LIMIT } from '@/constants/service';
import { priceHistoryMockData, tradingListMockData } from '@/mocks/datas/trading';
import { ApiResponse, CursorResponse } from '@/types/service/response';
import { PriceHistoryType, TradingItemType } from '@/types/trading';
import { delay, http, HttpResponse, HttpResponseResolver, RequestHandler, StrictResponse } from 'msw';

const HorseTradingHandler: HttpResponseResolver = async ({
  request,
}): Promise<StrictResponse<ApiResponse<CursorResponse<TradingItemType>>>> => {
  await delay(1000);

  const url = new URL(request.url);

  const cursorId = Number(url.searchParams.get('cursorId')) || 0;
  const limit = Number(url.searchParams.get('limit')) || CURSOR_LIMIT;

  const startIndex = cursorId;
  const endIndex = cursorId + limit;

  const items = tradingListMockData.slice(startIndex, endIndex);

  const hasNextItems = endIndex < tradingListMockData.length;
  const nextCursorId = hasNextItems ? endIndex : -1;

  const response = {
    errorCode: null,
    data: {
      items,
      hasNextItems,
      nextCursorId,
    },
  };

  return HttpResponse.json(response);
};

const priceHistoryHandler: HttpResponseResolver = async (): Promise<
  StrictResponse<ApiResponse<PriceHistoryType[]>>
> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: priceHistoryMockData,
  });
};

const sellHorseHandler: HttpResponseResolver = async (): Promise<StrictResponse<ApiResponse<null>>> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const purchaseHorseHandler: HttpResponseResolver = async (): Promise<StrictResponse<ApiResponse<null>>> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const cancelHorseSellingHandler: HttpResponseResolver = async (): Promise<StrictResponse<ApiResponse<null>>> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

export const handlers: RequestHandler[] = [
  http.get('/tradings', HorseTradingHandler),
  http.get('/tradings/registered-cards', HorseTradingHandler),
  http.get('/tradings/:hordeId/sold-cards', HorseTradingHandler),
  http.get('/tradings/:horseId/price-history', priceHistoryHandler),
  http.post('/tradings', sellHorseHandler),
  http.put('/tradings/:tradeId', purchaseHorseHandler),
  http.delete('/tradings/:tradeId', cancelHorseSellingHandler),
];
