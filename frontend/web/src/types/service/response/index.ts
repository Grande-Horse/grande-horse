export interface ApiResponse<T> {
  errorCode: string | null;
  data: T | null;
}

export interface CursorData<T> {
  items: Array<T>;
  hasNextItems: boolean;
  nextCursorId: number;
}
