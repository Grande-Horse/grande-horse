import axios, { AxiosInstance } from 'axios';

const { VITE_VUE_API_URL } = import.meta.env;

const instance: AxiosInstance = axios.create({
  baseURL: VITE_VUE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createApiClient = (): AxiosInstance => {
  return instance;
};
