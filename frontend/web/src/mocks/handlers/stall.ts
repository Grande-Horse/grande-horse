import { CURSOR_LIMIT } from '@/constants/service';
import { horseCardListMockDataV2 } from '@/mocks/datas/horse';
import { raceRecordMockData } from '@/mocks/datas/race';
import { HorseCardType } from '@/types/card';
import { RaceRecordType } from '@/types/race';
import { ApiResponse, CursorResponse } from '@/types/service/response';
import { delay, http, HttpResponse, HttpResponseResolver, RequestHandler, StrictResponse } from 'msw';

const HorseCardsHandler: HttpResponseResolver = async ({
  request,
}): Promise<StrictResponse<ApiResponse<CursorResponse<HorseCardType>>>> => {
  await delay(1000);

  const url = new URL(request.url);

  const cursorId = Number(url.searchParams.get('cursorId')) || 0;
  const limit = Number(url.searchParams.get('limit')) || CURSOR_LIMIT;

  const startIndex = cursorId;
  const endIndex = cursorId + limit;

  const items = horseCardListMockData.slice(startIndex, endIndex);

  const hasNextItems = endIndex < horseCardListMockData.length;
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

const raceRecordHandler: HttpResponseResolver = async (): Promise<StrictResponse<ApiResponse<RaceRecordType>>> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: raceRecordMockData,
  });
};

const combineHandler: HttpResponseResolver = async (): Promise<StrictResponse<ApiResponse<HorseCardType>>> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: horseCardMockData,
  });
};

export const handlers: RequestHandler[] = [
  http.get('/cards', HorseCardsHandler),
  http.get('/cards/:cardId/race-record', raceRecordHandler),
  http.post('/cards/combine', combineHandler),
];
