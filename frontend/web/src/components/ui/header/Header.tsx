import { defaultContent, infoContent, ranchContent, waitingRoomContent } from './HeaderContent';

interface HeaderProps {
  variant?: 'default' | 'info' | 'waitingRoom' | 'ranch';
  title?: string;
}

const commonStyle = 'flex items-center justify-between p-5';

const Header: React.FC<HeaderProps> = ({ variant = 'default', title }) => {
  const coin = 100000;
  const foot = 100000;

  return (
    <>
      {variant === 'default' && <header className={commonStyle}>{defaultContent({ coin, foot })}</header>}
      {variant === 'info' && <header className={commonStyle}>{infoContent({ title })}</header>}
      {variant === 'waitingRoom' && <header className={commonStyle}>{waitingRoomContent({ title })}</header>}
      {variant === 'ranch' && <header className={commonStyle}>{ranchContent({ coin, foot })}</header>}
    </>
  );
};

export default Header;
