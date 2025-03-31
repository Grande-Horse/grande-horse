import { createApiClient } from '@/services/http-commons';
import { ApiResponse } from '@/types/service/response';
import { AxiosResponse } from 'axios';

const client = createApiClient();

export const apiGet = async <U>(url: string, params?: Record<string, any>): Promise<U> => {
  return await apiRequest<null, U>('GET', url, null, params);
};

export const apiPost = async <T>(url: string, data: T) => {
  return await apiRequest<T, null>('POST', url, data);
};

export const apiPut = async <T>(url: string, data: T) => {
  await apiRequest<T, null>('PUT', url, data);
};

export const apiDelete = async <U>(url: string, params?: Record<string, any>): Promise<U> => {
  return await apiRequest<null, U>('DELETE', url, null, params);
};

const apiRequest = async <T, U>(method: Method, url: string, data?: T, params?: Record<string, string>): Promise<U> => {
  let response: AxiosResponse<ApiResponse<U>>;

  switch (method) {
    case 'GET':
      response = await client.get(url, { params });
      break;

    case 'POST':
      response = await client.post(url, data!);
      break;

    case 'PUT':
      response = await client.put(url, data!);
      break;

    case 'DELETE':
      response = await client.delete(url, { params });
      break;

    default:
      throw new Error('Invalid API Method');
  }

  const status = response.status;

  if (status >= 400) {
    throw new Error(status + ': ' + response.statusText);
  }

  const { errorCode, data: responseData } = response.data;

  if (errorCode) {
    throw new Error(errorCode);
  }

  return responseData as U;
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
