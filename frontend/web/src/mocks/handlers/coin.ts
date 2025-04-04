import { myCoin } from '@/mocks/datas/user';
import { ApiResponse } from '@/types/service/response';
import { delay, http, HttpResponse, HttpResponseResolver, RequestHandler, StrictResponse } from 'msw';

const myCoinHandler: HttpResponseResolver = async (): Promise<StrictResponse<ApiResponse<{ coin: number }>>> => {
  await delay(1000);

  return HttpResponse.json({
    errorCode: null,
    data: myCoin,
  });
};

export const handlers: RequestHandler[] = [http.get('/users/coin', myCoinHandler)];
