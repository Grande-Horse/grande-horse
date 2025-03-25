import { Link, useLocation } from 'react-router-dom';
import { bottomNavBarItem } from '@/constants/bottomNavBarIcon';

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const activeStyle = 'bg-primary';

  return (
    <nav className='bg-background z-bottomnavbar sticky bottom-0 flex h-24 w-full items-center justify-around'>
      {bottomNavBarItem.map((item, index) => {
        const isActive = location.pathname === item.pathname || location.pathname.startsWith(item.pathname + '/');
        return (
          <Link
            key={index}
            to={item.pathname}
            className={`hover:bg-primary flex w-full flex-col items-center justify-between py-2 ${isActive ? activeStyle : ''}`}
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
