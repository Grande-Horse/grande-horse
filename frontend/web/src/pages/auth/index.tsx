import kakaoLogo from '@/assets/images/kakao-logo.png';
import ssafyLogo from '@/assets/images/ssafy-logo.png';

const AuthPage: React.FC = () => {
  const landscapeSrc = 'src/assets/images/backgrounds/loginBgLandscape.png';
  const upperCloudSrc = 'src/assets/images/backgrounds/loginBgCloudUpper.png';
  const lowerCloudSrc = 'src/assets/images/backgrounds/loginBgCloudLower.png';

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
  const loginButton = (logo: string, text: string) => (
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

  return (
    <div
      className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-repeat-x'
      style={{ backgroundImage: `url(${landscapeSrc})` }}
    >
      <UpperCloud />
      <LowerCloud />
      <TitlePanel />
      <div className='absolute bottom-[15%] flex flex-col items-center justify-center gap-4'>
        {loginButton(kakaoLogo, '카카오')}
        {loginButton(ssafyLogo, 'SSAFY')}
      </div>
    </div>
  );
};

export default AuthPage;
