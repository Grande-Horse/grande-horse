import ErrorIcon from '@/assets/icons/errorIcon.svg?react';
import { getCustomErrorMessage } from '@/utils/error';

interface ErrorProps {
  errorMessage?: string;
}

const Error: React.FC<ErrorProps> = ({ errorMessage = '' }) => {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-2'>
      <ErrorIcon />
      <p>오류가 발생하였습니다...</p>
      <p>{getCustomErrorMessage(errorMessage)}</p>
    </div>
  );
};

export default Error;
