import kakaoLogo from '@/assets/images/kakao-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import ssafyLogo from '@/assets/images/ssafy-logo.png';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../register/AuthContextProvider';

const LandingPage: React.FC = () => {
  const landscapeSrc = 'src/assets/images/backgrounds/landingBgLandscape.png';
  const upperCloudSrc = 'src/assets/images/backgrounds/landingBgCloudUpper.png';
  const lowerCloudSrc = 'src/assets/images/backgrounds/landingBgCloudLower.png';

  interface CloudBgProps {
    position: 'upper' | 'lower';
  }

  const CloudBg = ({ position }: CloudBgProps) => (
    <div
      className={`animate-moveCloud${position.charAt(0).toUpperCase() + position.slice(1)} absolute top-0 left-0 h-screen w-full bg-cover bg-repeat-x`}
      style={{ backgroundImage: `url(${position === 'upper' ? upperCloudSrc : lowerCloudSrc})` }}
    />
  );

  interface LoginButtonProps {
    logo: string;
    text: string;
    onClick: () => void;
  }

  const LoginButton = ({ logo, text, onClick }: LoginButtonProps) => (
    <div
      className={`relative flex w-sm items-center justify-center rounded-md p-4 text-black ${text === 'Kakao' ? 'bg-kakao' : 'bg-ssafy'}`}
      onClick={onClick}
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

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authContext?.state.isAuthenticated) {
      navigate('/');
    }
  }, [authContext?.state.isAuthenticated, navigate]);

  if (authContext?.state.loading) return <div>로딩 중...</div>;

  return (
    <div
      className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-repeat-x'
      style={{ backgroundImage: `url(${landscapeSrc})` }}
    >
      <CloudBg position='upper' />
      <CloudBg position='lower' />
      <TitlePanel />
      <div className='absolute bottom-[15%] flex flex-col items-center justify-center gap-4'>
        <LoginButton text='SSAFY' logo={ssafyLogo} onClick={() => authContext?.handleOauthRedirect('SSAFY')} />
        <LoginButton text='Kakao' logo={kakaoLogo} onClick={() => authContext?.handleOauthRedirect('KAKAO')} />

        {authContext?.state.error && <div className='text-warning'>{authContext?.state.error}</div>}
      </div>
    </div>
  );
};

export default LandingPage;
