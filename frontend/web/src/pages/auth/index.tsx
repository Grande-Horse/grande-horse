import { oauthLogin } from '@/services/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { OAuthCallbackResponse } from '@/types/auth';

const handleOauthCallback = async (): Promise<OAuthCallbackResponse> => {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  if (!code) {
    return {
      success: false,
      error: {
        code: 'NO_CODE',
        message: '인증 코드가 없습니다.',
      },
    };
  }

  try {
    await oauthLogin({
      socialProvider: 'SSAFY',
      code,
    });
    return {
      success: true,
      message: '로그인이 완료되었습니다.',
    };
  } catch (error) {
    console.error('OAuth 로그인 실패:', error);
    return {
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: '로그인 처리 중 오류가 발생했습니다.',
      },
    };
  }
};

const AuthPage = () => {
  const [response, setResponse] = useState<OAuthCallbackResponse | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    handleOauthCallback().then((result) => {
      setResponse(result);
    });
  }, []);

  useEffect(() => {
    if (response?.success) {
      navigate('/register');
    } else {
      navigate('/landing');
    }
  }, [response, navigate]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-4'>
      <ClipLoader size={36} color='#3D4B63' />
      <span className='text-body1'>
        {response?.success ? '로그인 중입니다...' : response?.error?.message || '처리 중입니다...'}
      </span>
    </div>
  );
};

export default AuthPage;
