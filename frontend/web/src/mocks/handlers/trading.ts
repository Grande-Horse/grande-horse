import { CURSOR_LIMIT } from '@/constants/service';
import { priceHistoryMockData, RegisteredListMockData } from '@/mocks/datas/trading';
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

  const items = RegisteredListMockData.slice(startIndex, endIndex);

  const hasNextItems = endIndex < RegisteredListMockData.length;
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

const priceHistoryHandler: HttpResponseResolver = (): StrictResponse<ApiResponse<PriceHistoryType[]>> => {
  return HttpResponse.json({
    errorCode: null,
    data: priceHistoryMockData,
  });
};

const sellHorseHandler: HttpResponseResolver = (): StrictResponse<ApiResponse<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const purchaseHorseHandler: HttpResponseResolver = (): StrictResponse<ApiResponse<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

const cancelHorseSellingHandler: HttpResponseResolver = (): StrictResponse<ApiResponse<null>> => {
  return HttpResponse.json({
    errorCode: null,
    data: null,
  });
};

export const handlers: RequestHandler[] = [
  http.get('/tradings', HorseTradingHandler),
  http.get('/tradings/registered-cards', HorseTradingHandler),
  http.get('/tradings/:horseId/price-history', priceHistoryHandler),
  http.post('/tradings', sellHorseHandler),
  http.put('/tradings/:tradeId', purchaseHorseHandler),
  http.delete('/tradings/:tradeId', cancelHorseSellingHandler),
];
