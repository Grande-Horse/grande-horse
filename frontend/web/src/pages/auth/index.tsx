// auth/index.tsx - OAuth 콜백 처리 개선
import { oauthLogin } from '@/services/auth';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
<<<<<<< HEAD
import { AuthContext } from '../auth/AuthContextProvider';
=======
import { AuthContext } from '@/pages/auth/AuthContextProvider';
>>>>>>> f397ca365844a74e9aa1e238439590013da644c3

const AuthPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get('code');
      const provider = sessionStorage.getItem('oauthProvider') || 'SSAFY';

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
        if (response?.redirectUrl === '/') {
          authContext?.dispatch({
            type: 'LOGIN_SUCCESS',
          });
        } else if (response?.redirectUrl === '/register') {
          authContext?.dispatch({
            type: 'REGISTER_REQUIRED',
          });
        }
        navigate(response?.redirectUrl, { replace: true });
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
        <ClipLoader size={50} color='#FFF' />
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