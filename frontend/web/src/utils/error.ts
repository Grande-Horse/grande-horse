import { customError } from '@/constants/error';

export const getCustomErrorMessage = (code: string) => {
  const err = Object.values(customError).find((err) => err.code === code);

  if (err) {
    return err.message;
  }

  return code;
};
