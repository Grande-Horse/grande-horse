import { MarketContent, StallContent, RaceTrackContent } from '@/components/ui/header/HeaderContent';
import { useLocation, useSearchParams } from 'react-router-dom';

const commonStyle = 'flex items-center justify-between p-5 h-24 sticky top-0 z-header w-full bg-background';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  /* 재화(코인, 발걸음) api 연결 후 캐시 데이터로 저장*/
  const coin = 100000;
  const foot = 100000;

  const contentMap = [
    { path: '/market', component: <MarketContent coin={coin} foot={foot} /> },
    { path: '/stall', component: <StallContent title='마구간' /> },
    {
      path: '/racetrack',
      component: <RaceTrackContent title={searchParams.get('title') || '방 제목을 입력해주세요.'} />,
    },
  ];

  const content = contentMap.find((item) => pathname.startsWith(item.path))?.component;

  return content && <header className={commonStyle}>{content}</header>;
};

export default Header;
