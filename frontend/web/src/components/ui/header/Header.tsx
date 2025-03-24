import { DefaultContent, InfoContent, PastureContent, WaitingRoomContent } from '@/components/ui/header/HeaderContent';

interface HeaderProps {
  variant?: 'default' | 'info' | 'waitingRoom' | 'pasture';
  title?: string;
}

const commonStyle = 'flex items-center justify-between p-5 h-24 sticky top-0 z-header w-full bg-background';

const Header: React.FC<HeaderProps> = ({ variant = 'default', title }) => {
  const coin = 100000;
  const foot = 100000;

  const component = {
    default: <DefaultContent coin={coin} foot={foot} />,
    info: <InfoContent title={title} />,
    waitingRoom: <WaitingRoomContent title={title} />,
    pasture: <PastureContent coin={coin} foot={foot} />,
  };

  return <header className={commonStyle}>{component[variant]}</header>;
};

export default Header;
