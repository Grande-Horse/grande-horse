import { getMyCoin } from '@/services/coin';
import { useQuery } from '@tanstack/react-query';
import {
  DefaultContent,
  StallContent,
  RaceTrackContent,
  LandingContent,
  RaceTrackRoomContent,
} from '@/components/ui/header/HeaderContent';
import { useLocation, useSearchParams } from 'react-router-dom';
import { queryKey } from '@/constants/queryKey';

const commonStyle = 'flex items-center justify-between p-5 h-24 sticky top-0 z-header w-full';

const Header: React.FC = () => {
  const { pathname, state } = useLocation();
  const [searchParams] = useSearchParams();

  /* 재화(코인, 발걸음) api 연결 후 캐시 데이터로 저장*/
  const { data } = useQuery({
    queryKey: [queryKey.COIN],
    queryFn: getMyCoin,
  });

  const coin = data?.coin ?? 0;
  const foot = 100000;

  const contentMap = [
    { path: '/market', component: <DefaultContent coin={coin} foot={foot} /> },
    {
      path: '/racetrack/room',
      component: <RaceTrackRoomContent state={state} title={searchParams.get('title') || '방 제목을 입력해주세요.'} />,
    },
    { path: '/racetrack', component: <RaceTrackContent coin={coin} foot={foot} /> },
    { path: '/stall', component: <StallContent title='마구간' /> },
    { path: '/landing', component: <LandingContent /> },
    { path: '/', component: <LandingContent /> },
  ];

  const dynamicRacePath = /^\/racetrack\/room\/([^/]+)\/race$/;
  if (dynamicRacePath.test(pathname)) {
    return null;
  }

  const content = contentMap.find((item) => pathname === item.path || pathname.startsWith(item.path))?.component;

  return content && <header className={commonStyle}>{content}</header>;
};

export default Header;
