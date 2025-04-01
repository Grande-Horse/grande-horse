import Modal from '@/components/ui/modal/Modal';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import useRegister from '../../hooks/useRegister';

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
    <Button disabled={isDisabled} onClick={onCheckNickname} className='disabled:bg-gray min-w-[100px]'>
      중복 확인
    </Button>
  </div>
);

interface NicknameCheckProps {
  isAvailable: boolean;
}

const NicknameCheck = ({ isAvailable }: NicknameCheckProps) => (
  <div className={`text-sm font-medium ${isAvailable ? 'text-green-500' : 'text-warning'}`}>
    {isAvailable ? '사용 가능한 닉네임입니다.' : '이미 사용중인 닉네임입니다.'}
  </div>
);

const LoadingMessage = ({ message }: { message: string }) => <div className=''>{message}</div>;
const ErrorMessage = ({ message }: { message: string }) => <div className='text-warning'>{message}</div>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { state, setNickname, validateNickname, submitRegistration } = useRegister();

  const handleRegister = async () => {
    await submitRegistration();
    navigate('/');
  };

  return (
    <div className='flex w-full flex-col items-center justify-center gap-4 p-6'>
      <h1 className='text-2xl font-bold'>회원가입</h1>

      <NicknameInput
        nickname={state.nickname}
        onNicknameChange={setNickname}
        onCheckNickname={validateNickname}
        isDisabled={!state.nickname}
      />

      <Button
        disabled={!state.isNicknameChecked || !state.isNicknameAvailable || state.isNetworkError}
        onClick={handleRegister}
        className='bg-green hover:bg-green disabled:bg-gray max-w-md'
      >
        회원가입
      </Button>
      {state.isLoading && <LoadingMessage message='처리 중...' />}
      {state.isNetworkError && <ErrorMessage message={state.isError ?? ''} />}
      {state.isNicknameChecked && !state.isNetworkError && (
        <NicknameCheck isAvailable={state.isNicknameAvailable ?? false} />
      )}
    </div>
  );
};

const RegisterPage = () => (
  <div className='flex h-full flex-col items-center'>
    <Modal isOpen={true} onClose={() => {}}>
      <RegisterForm />
    </Modal>
  </div>
);

export default RegisterPage;
