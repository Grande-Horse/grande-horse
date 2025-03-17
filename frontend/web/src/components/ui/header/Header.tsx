import { DefaultContent, InfoContent, RanchContent, WaitingRoomContent } from '@/components/ui/header/HeaderContent';

interface HeaderProps {
  variant?: 'default' | 'info' | 'waitingRoom' | 'ranch';
  title?: string;
}

const commonStyle = 'flex items-center justify-between p-5 sticky top-0 z-10 w-full';

const Header: React.FC<HeaderProps> = ({ variant = 'default', title }) => {
  const coin = 100000;
  const foot = 100000;

  const component = {
    default: <DefaultContent coin={coin} foot={foot} />,
    info: <InfoContent title={title} />,
    waitingRoom: <WaitingRoomContent title={title} />,
    ranch: <RanchContent coin={coin} foot={foot} />,
  };

  return <header className={commonStyle}>{component[variant]}</header>;
};

export default Header;
