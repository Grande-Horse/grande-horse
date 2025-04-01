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
      errorCode: 'A1',
      data: {
        redirectUrl: '/',
      },
    };
  }

  try {
    await oauthLogin({
      socialProvider: 'SSAFY',
      code,
    });
    return {
      errorCode: '',
      data: {
        redirectUrl: '/register',
      },
    };
  } catch (error) {
    console.error('OAuth 로그인 실패:', error);
    return {
      errorCode: 'A1',
      data: {
        redirectUrl: '/',
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
    if (response?.errorCode === '') navigate(response?.data.redirectUrl);
  }, [response, navigate]);

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-4'>
      <ClipLoader size={36} color='#3D4B63' />
      <span className='text-body1'>{response?.errorCode === '' ? '로그인 중입니다...' : '처리 중입니다...'}</span>
    </div>
  );
};

export default AuthPage;
