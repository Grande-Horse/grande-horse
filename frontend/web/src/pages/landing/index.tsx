import kakaoLogo from '@/assets/images/kakao-logo.png';
import { useNavigate } from 'react-router-dom';
import ssafyLogo from '@/assets/images/ssafy-logo.png';
import { postAutoLogin } from '@/services/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const landscapeSrc = 'src/assets/images/backgrounds/landingBgLandscape.png';
  const upperCloudSrc = 'src/assets/images/backgrounds/landingBgCloudUpper.png';
  const lowerCloudSrc = 'src/assets/images/backgrounds/landingBgCloudLower.png';

  const UpperCloud = () => (
    <div
      className='animate-moveCloudUpper absolute top-0 left-0 h-screen w-full bg-cover bg-repeat-x'
      style={{ backgroundImage: `url(${upperCloudSrc})` }}
    />
  );

  const LowerCloud = () => (
    <div
      className='animate-moveCloudLower absolute bottom-0 left-0 h-screen w-full bg-cover bg-repeat-x'
      style={{ backgroundImage: `url(${lowerCloudSrc})` }}
    />
  );
  const LoginButton = (logo: string, text: string) => (
    <div
      className={`relative flex w-sm items-center justify-center rounded-md p-4 text-black ${text === '카카오' ? 'bg-kakao' : 'bg-ssafy'}`}
    >
      <img className='absolute left-5 min-h-8 w-8' alt={`${text} 로그인`} src={logo} />
      <span className='flex w-full justify-center'>{text} 로그인</span>
    </div>
  );

  const TitlePanel = () => {
    return (
      <div className='absolute top-0 left-1/2 aspect-300/278 w-2/3 -translate-x-1/2 transform bg-[url("src/assets/images/appTitleBg.png")] bg-contain bg-center bg-no-repeat'>
        <div className='absolute top-[70%] right-0 left-0 -translate-y-1/2'>
          <h1 className='text-stroke text-heading1 flex flex-col items-center justify-center px-20 text-nowrap'>
            <span className='w-full text-start'>그런데</span>
            <span className='w-full text-end'>말입니다</span>
          </h1>
        </div>
      </div>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAutoLogin = async () => {
    try {
      const response = await postAutoLogin();
      console.log(response);

      //TODO: 로그인 상태 분기처리
      if (response.errorCode === '') {
        setIsLoggedIn(true);
      } else {
        console.error('로그인 실패');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleAutoLogin();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, isLoading, navigate]);

  return (
    isLoading &&
    !isLoggedIn && (
      <div
        className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-repeat-x'
        style={{ backgroundImage: `url(${landscapeSrc})` }}
      >
        <UpperCloud />
        <LowerCloud />
        <TitlePanel />
        <div className='absolute bottom-[15%] flex flex-col items-center justify-center gap-4'>
          <Link to='/register'>{LoginButton(kakaoLogo, '카카오')}</Link>
          <Link to='/register'>{LoginButton(ssafyLogo, 'SSAFY')}</Link>
          <button onClick={handleAutoLogin}>자동 로그인</button>
        </div>
      </div>
    )
  );
};

export default LandingPage;
