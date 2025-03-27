import { Link } from 'react-router-dom';
import { bottomNavBarItem } from '@/constants/bottomNavBarIcon';

const BottomNavBar: React.FC = () => {
  return (
    <nav className='bg-background z-bottomnavbar sticky bottom-0 flex h-24 w-full items-center justify-around'>
      {bottomNavBarItem.map((item, index) => {
        return (
          <Link
            key={index}
            to={item.pathname}
            className='hover:bg-primary flex w-full flex-col items-center justify-between py-2'
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
