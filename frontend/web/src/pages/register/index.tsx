import { useState } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '@/pages/auth/AuthContextProvider'; // AuthContext import
import { checkNicknameDuplicated } from '@/services/auth';
import ModalWrapper from '@/components/ui/modal/ModalWrapper';
interface NicknameInputProps {
  nickname: string;
  onNicknameChange: (value: string) => void;
  onCheckNickname: () => void;
  isDisabled: boolean;
}

const NicknameInput = ({ nickname, onNicknameChange, onCheckNickname, isDisabled }: NicknameInputProps) => (
  <div className='flex w-full max-w-md justify-center gap-2'>
    <Input
      type='text'
      placeholder='닉네임'
      value={nickname}
      onChange={(e) => onNicknameChange(e.target.value)}
      className='flex-1'
    />
    <Button disabled={isDisabled} onClick={onCheckNickname} className='disabled:bg-gray min-w-[90px]'>
      중복 확인
    </Button>
  </div>
);

interface NicknameCheckProps {
  isAvailable: boolean;
}

const NicknameCheck = ({ isAvailable }: NicknameCheckProps) => (
  <div className='h-4'>
    <div
      className={`text-md font-medium transition-opacity duration-200 ${
        isAvailable ? 'text-green-500 opacity-100' : 'text-warning opacity-100'
      }`}
    >
      {isAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용중인 닉네임입니다.'}
    </div>
  </div>
);

const LoadingIndicator = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className='flex items-center gap-2'>
      {isLoading && (
        <ClipLoader className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' color='white' size={30} />
      )}
    </div>
  );
};
const ErrorMessage = ({ message }: { message: string }) => <div className='text-warning h-4'>{message}</div>;

// NicknameInput, NicknameCheck, LoadingIndicator 컴포넌트는 그대로 유지

const RegisterForm = () => {
  const navigate = useNavigate();
  const { state: authState, handleRegister } = useAuth(); // AuthContext 사용

  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setIsNicknameChecked(false);
    setError(null);
  };

  const validateNickname = async () => {
    if (!nickname) return;

    setIsLoading(true);
    setError(null);

    try {
      const isDuplicated = await checkNicknameDuplicated(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(!isDuplicated);
      setIsLoading(false);
    } catch (error) {
      setIsNicknameChecked(false);
      setIsNicknameAvailable(null);
      setIsLoading(false);

      if (error.response?.data?.errorCode === 'U1') {
        setError('이미 등록된 닉네임입니다.');
      } else if (error.response?.data?.errorCode === 'C1') {
        setError('닉네임은 최소 3자 이상 최대 10자 이하여야 합니다.');
      } else {
        setError('닉네임 중복 확인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleRegisterSubmit = async () => {
    if (!isNicknameChecked || !isNicknameAvailable) return;

    setIsLoading(true);
    try {
      // AuthContext의 handleRegister 사용
      await handleRegister(nickname);
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full flex-col items-center justify-center gap-3 pb-4'>
      <h1 className='text-stroke text-heading2 pb-4'>회원가입</h1>

      <NicknameInput
        nickname={nickname}
        onNicknameChange={handleNicknameChange}
        onCheckNickname={validateNickname}
        isDisabled={!nickname}
      />

      <LoadingIndicator isLoading={isLoading} />
      <Button
        disabled={!isNicknameChecked || !isNicknameAvailable || !!error || authState.isLoading}
        onClick={handleRegisterSubmit}
        className='bg-green hover:bg-green disabled:bg-gray max-w-md'
      >
        회원가입
      </Button>
      {error && <ErrorMessage message={error} />}
      {isNicknameChecked && !error && <NicknameCheck isAvailable={isNicknameAvailable ?? false} />}
      {authState.error && <ErrorMessage message={authState.error} />}
    </div>
  );
};

const RegisterPage = () => (
  <div className='flex h-full flex-col items-center'>
    <ModalWrapper close={() => {}}>
      <RegisterForm />
    </ModalWrapper>
  </div>
);

export default RegisterPage;
