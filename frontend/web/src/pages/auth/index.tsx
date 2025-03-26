const AuthPage: React.FC = () => {
  const landscapeSrc = 'src/assets/images/backgrounds/loginBgLandscape.png';
  const upperCloudSrc = 'src/assets/images/backgrounds/loginBgCloudUpper.png';
  const lowerCloudSrc = 'src/assets/images/backgrounds/loginBgCloudLower.png';

  const UpperCloud = () => (
    <div
      className='animate-moveCloudUpper absolute top-0 left-0 h-full w-full bg-[length:calc(2*100%)] bg-repeat-x'
      style={{ backgroundImage: `url(${upperCloudSrc})` }}
    />
  );

  const LowerCloud = () => (
    <div
      className='animate-moveCloudLower absolute bottom-0 left-0 h-full w-full bg-[length:calc(2*100%)] bg-repeat-x'
      style={{ backgroundImage: `url(${lowerCloudSrc})` }}
    />
  );

  const KakaoLogin = () => <button className='bg-kakao w-sm rounded-sm p-4 text-black'>카카오 로그인</button>;

  const SsafyLogin = () => <button className='bg-ssafy w-sm rounded-sm p-4 text-black'>SSAFY 로그인</button>;

  return (
    <div
      className='relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[length:calc(2*100%)] bg-repeat-x'
      style={{ backgroundImage: `url(${landscapeSrc})` }}
    >
      <UpperCloud />
      <LowerCloud />

      <div className='min-h-1/3 min-w-1/2 flex-col items-center justify-center bg-[url("src/assets/images/appTitleBg.png")] bg-contain bg-center bg-no-repeat p-6'>
        <h1 className='text-stroke text-heading1 flex w-full flex-col items-center justify-center p-20 text-nowrap'>
          <span className='w-full text-left'>그런데</span>
          <span className='w-full text-right'>말입니다</span>
        </h1>
      </div>

      <div className='absolute bottom-0 flex w-full flex-col items-center justify-center'>
        <KakaoLogin />
        <SsafyLogin />
      </div>
    </div>
  );
};

export default AuthPage;