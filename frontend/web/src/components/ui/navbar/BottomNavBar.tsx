import { Link, useLocation } from 'react-router-dom';
import { bottomNavBarItem } from '@/constants/bottomNavBarIcon';

const BottomNavBar: React.FC = () => {
  const { pathname } = useLocation();
  const activeStyle = 'bg-primary';
  const rootActiveStyle = 'bg-primary/10';
  const rootHoverStyle = 'hover:bg-primary/10';

  const excludedPaths = [{ path: '/landing' }, { path: '/racetrack/room' }, { path: '/racetrack/room/race' }];
  const isNotRender = excludedPaths.some((item) => pathname.startsWith(item.path));
  const isRoot = pathname === '/';

  if (isNotRender) {
    return null;
  }

  return (
    <nav
      className={`${isRoot ? 'bg-transparent' : 'bg-background'} z-bottomnavbar sticky bottom-0 flex h-24 w-full items-center justify-around`}
    >
      {bottomNavBarItem.map((item, index) => {
        const isActive = location.pathname === item.pathname || location.pathname.startsWith(item.pathname + '/');
        return (
          <Link
            key={index}
            to={item.pathname}
            className={`hover:bg-primary flex w-full flex-col items-center justify-between py-2 ${isActive ? activeStyle : ''} ${isRoot && isActive ? rootActiveStyle : ''} ${isRoot ? rootHoverStyle : ''}`}
          >
            <item.icon className='size-14' />
            <p className='text-stroke text-detail2'>{item.text}</p>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
