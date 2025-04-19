import kakaoLogo from '@/assets/images/kakao-logo.png';
import { useNavigate } from 'react-router-dom';
import ssafyLogo from '@/assets/images/ssafy-logo.png';
import { useEffect, useContext } from 'react';
import { AuthContext } from '@/pages/auth/AuthContextProvider';
import { ClipLoader } from 'react-spinners';
import { autoLogin } from '@/services/auth';

const cloudBgImages = {
  upper: `bg-[url(@/assets/images/backgrounds/landingBgCloudUpper.png)]`,
  lower: `bg-[url(@/assets/images/backgrounds/landingBgCloudLower.png)]`,
} as const;

const bgImages = {
  landscape: `bg-[url(@/assets/images/backgrounds/landingBgLandscape.png)]`,
  titlePanel: `bg-[url(@/assets/images/appTitleBg.png)]`,
} as const;

const LandingPage: React.FC = () => {
  interface CloudBgProps {
    position: 'upper' | 'lower';
  }

  const CloudBg = ({ position }: CloudBgProps) => (
    <div
      className={`${cloudBgImages[position]} w-base fixed -top-1 h-screen bg-cover bg-repeat-x animate-moveCloud${position.charAt(0).toUpperCase() + position.slice(1)}`}
    />
  );

  interface LoginButtonProps {
    logo: string;
    text: string;
    onClick: () => void;
  }

  const LoginButton = ({ logo, text, onClick }: LoginButtonProps) => (
    <div
      className={`relative flex w-96 items-center justify-center rounded-sm p-4 text-black inset-shadow-sm inset-shadow-white/30 ${text === 'Kakao' ? 'bg-kakao' : 'bg-ssafy'}`}
      onClick={onClick}
    >
      <img className='absolute left-5 min-h-8 w-8' alt={`${text} 로그인`} src={logo} />
      <span className='text-body1 flex w-full justify-center'>{text} Login</span>
    </div>
  );

  const TitlePanel = () => {
    return (
      <div className='w-base fixed top-0 h-screen'>
        <div
          className={`absolute top-0 left-1/2 aspect-square w-3/5 -translate-x-1/2 transform ${bgImages.titlePanel} bg-contain bg-center bg-no-repeat`}
        >
          <div className='absolute top-[70%] right-0 left-0 -translate-y-1/2'>
            <h1 className='text-stroke text-heading3 flex flex-col items-center justify-center px-20 text-nowrap'>
              <span className='-translate-x-1/2'>그런데</span>
              <span className='translate-x-1/3'>말입니다</span>
            </h1>
          </div>
        </div>
      </div>
    );
  };

  const authContext = useContext(AuthContext);

  if (authContext?.state.isLoading)
    return (
      <div className='flex h-screen w-full items-center justify-center'>
        <ClipLoader color='#FFF' size={50} />
      </div>
    );

  return (
    <div className={`relative flex h-[calc(100vh-6rem)] w-full flex-col items-center justify-center overflow-hidden`}>
      <div className={`w-base fixed top-0 h-screen ${bgImages.landscape} bg-cover bg-repeat-x`}></div>
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
