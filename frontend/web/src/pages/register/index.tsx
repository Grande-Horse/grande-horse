import Modal from '@/components/ui/modal/Modal';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import useRegister from '@/hooks/useRegister';
import { ClipLoader } from 'react-spinners';

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

const RegisterForm = () => {
  const navigate = useNavigate();
  const { state, setNickname, validateNickname, submitRegistration } = useRegister();

  const handleRegisterRedirect = async () => {
    const reponse = await submitRegistration();
    if (reponse.errorCode === '') {
      navigate('/', { replace: true });
    } else {
      console.error(state.isError);
    }
  };

  return (
    <div className='flex w-full flex-col items-center justify-center gap-3 pb-4'>
      <h1 className='text-stroke text-heading2 pb-4'>회원가입</h1>

      <NicknameInput
        nickname={state.nickname}
        onNicknameChange={setNickname}
        onCheckNickname={validateNickname}
        isDisabled={!state.nickname}
      />

      <LoadingIndicator isLoading={state.isLoading} />
      <Button
        disabled={!state.isNicknameChecked || !state.isNicknameAvailable || state.isNetworkError}
        onClick={handleRegisterRedirect}
        className='bg-green hover:bg-green disabled:bg-gray max-w-md'
      >
        회원가입
      </Button>
      {state.isNetworkError && <ErrorMessage message={state.isError ?? ''} />}
      {state.isNicknameChecked && !state.isNetworkError && (
        <NicknameCheck isAvailable={state.isNicknameAvailable ?? false} />
      )}
    </div>
  );
};

const RegisterPage = () => (
  <div className='flex h-full flex-col items-center'>
    <Modal isOpen={true} onClose={() => {}} onConfirm={() => {}}>
      <RegisterForm />
    </Modal>
  </div>
);

export default RegisterPage;
