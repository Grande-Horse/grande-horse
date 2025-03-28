import { createApiClient } from '@/services/http-commons';
import { ApiResponseType } from '@/types/service';
import axios, { AxiosError, AxiosResponse } from 'axios';

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
  try {
    let response: AxiosResponse<ApiResponseType<U>>;

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
        throw new Error('Invalid method');
    }

    const { errorCode, data: responseData } = response.data;

    if (errorCode) {
      throw new Error(`API error occurred: ${errorCode}`);
    }

    return responseData as U;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleErrors(error);
    }
    throw error;
  }
};

const handleErrors = (error: AxiosError) => {
  console.error(error.message);
  // TODO: 에러 코드에 대한 추가적인 핸들링
};

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
