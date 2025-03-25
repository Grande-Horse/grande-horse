const AuthPage: React.FC = () => {
  const landscapeSrc = 'src/assets/images/backgrounds/loginBgLandscape.png';
  const upperCloudSrc = 'src/assets/images/backgrounds/loginBgCloudUpper.png';
  const lowerCloudSrc = 'src/assets/images/backgrounds/loginBgCloudLower.png';

  const upperCloud = () => (
    <div
      className='animate-moveCloudUpper absolute top-0 left-0 h-full w-full bg-[length:calc(2*100%)] bg-repeat-x'
      style={{ backgroundImage: `url(${upperCloudSrc})` }}
    />
  );

  const lowerCloud = () => (
    <div
      className='animate-moveCloudLower absolute bottom-0 left-0 h-full w-full bg-[length:calc(2*100%)] bg-repeat-x'
      style={{ backgroundImage: `url(${lowerCloudSrc})` }}
    />
  );

  return (
    <div
      className='relative h-[calc(100vh-12rem)] w-full overflow-hidden bg-[length:calc(2*100%)] bg-repeat-x'
      style={{ backgroundImage: `url(${landscapeSrc})` }}
    >
      {upperCloud()}
      {lowerCloud()}
    </div>
  );
};

export default AuthPage;
