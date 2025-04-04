import { getMyCoin } from '@/services/coin';
import { useQuery } from '@tanstack/react-query';
import { DefaultContent, StallContent, RaceTrackContent, LandingContent } from '@/components/ui/header/HeaderContent';
import { useLocation, useSearchParams } from 'react-router-dom';

const commonStyle = 'flex items-center justify-between p-5 h-24 sticky top-0 z-header w-full';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  /* 재화(코인, 발걸음) api 연결 후 캐시 데이터로 저장*/
  const { data: { coin } = { coin: 0 } } = useQuery({
    queryKey: ['coin'],
    queryFn: getMyCoin,
  });

  const foot = 100000;

  const contentMap = [
    { path: '/market', component: <DefaultContent coin={coin} foot={foot} /> },
    {
      path: '/racetrack/room',
      component: <RaceTrackContent title={searchParams.get('title') || '방 제목을 입력해주세요.'} />,
    },
    { path: '/racetrack', component: <DefaultContent coin={coin} foot={foot} /> },
    { path: '/stall', component: <StallContent title='마구간' /> },
    { path: '/landing', component: <LandingContent /> },
  ];

  const content = contentMap.find((item) => pathname === item.path || pathname.startsWith(item.path))?.component;

  return content && <header className={commonStyle}>{content}</header>;
};

export default Header;
