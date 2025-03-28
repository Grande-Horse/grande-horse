export interface ApiResponseType<T> {
  errorCode: string | null;
  data: T | null;
}
