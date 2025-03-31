import { oauthLogin } from '@/services/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const handleOauthCallback = async (): Promise<boolean> => {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  if (code) {
    try {
      const response = await oauthLogin({
        socialProvider: 'SSAFY',
        code,
      });
      console.log('로그인 성공:', response);
      return true;
    } catch (error) {
      console.error('OAuth 로그인 실패:', error);
      return false;
    }
  }
};

const AuthPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSuccess(handleOauthCallback());
  }, []);

  if (isSuccess) {
    navigate('/register');
  }
  return <div>AuthPage</div>;
};

export default AuthPage;
