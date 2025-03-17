import { DefaultContent, InfoContent, RanchContent, WaitingRoomContent } from './HeaderContent';

interface HeaderProps {
  variant?: 'default' | 'info' | 'waitingRoom' | 'ranch';
  title?: string;
}

const commonStyle = 'flex items-center justify-between p-5 sticky top-0 z-10 w-full';

const Header: React.FC<HeaderProps> = ({ variant = 'default', title }) => {
  const coin = 100000;
  const foot = 100000;

  return (
    <>
      {variant === 'default' && (
        <header className={commonStyle}>
          <DefaultContent coin={coin} foot={foot} />
        </header>
      )}
      {variant === 'info' && (
        <header className={commonStyle}>
          <InfoContent title={title} />
        </header>
      )}
      {variant === 'waitingRoom' && (
        <header className={commonStyle}>
          <WaitingRoomContent title={title} />
        </header>
      )}
      {variant === 'ranch' && (
        <header className={commonStyle}>
          <RanchContent coin={coin} foot={foot} />
        </header>
      )}
    </>
  );
};

export default Header;
