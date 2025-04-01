// auth/index.tsx - OAuth 콜백 처리 개선
import { oauthLogin } from '@/services/auth';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { AuthContext } from '../auth/AuthContextProvider';

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');
      const provider = sessionStorage.getItem('oauthProvider') || 'SSAFY'; // 기본값 설정

      if (!code) {
        setError('인증 코드가 없습니다');
        navigate('/landing');
        return;
      }

      try {
        setLoading(true);
        const response = await oauthLogin({
          socialProvider: provider,
          code,
        });

        // 응답 데이터로 AuthContext 상태 업데이트
        // response?.data.redirectUrl === '/' 일 경우 등록된 사용자
        if (response?.data.redirectUrl === '/') {
          authContext?.dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.user },
          });
          navigate('/');
        } else if (response?.data.redirectUrl === '/register') {
          authContext?.dispatch({
            type: 'REGISTER_REQUIRED',
            payload: { user: response.user },
          });
          navigate('/register');
        }
      } catch (error) {
        console.error('OAuth 로그인 실패:', error);
        setError('로그인 처리 중 오류가 발생했습니다');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, authContext]);

  if (loading) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-4'>
        <ClipLoader size={36} color='#3D4B63' />
        <span className='text-body1'>로그인 처리 중입니다...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-4'>
        <span className='text-warning'>{error}</span>
      </div>
    );
  }

  return null;
};

export default AuthPage;