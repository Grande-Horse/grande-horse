import { Link } from 'react-router-dom';
import { bottomNavBarIcon } from '@/constants/bottomNavBarIcon';

interface BottomNavBarProps {
  variant: 'default' | 'stall' | 'horseDeal';
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ variant }) => {
  return (
    <>
      <nav className='sticky bottom-0 flex w-full items-center justify-around'>
        {bottomNavBarIcon[variant].map((content, index) => {
          return (
            <Link
              key={index}
              to={{ pathname: '/' }}
              className='hover:bg-primary flex w-full flex-col items-center justify-between py-3'
            >
              <content.icon className='size-14' />
              <p className='text-stroke text-xl'>{content.text}</p>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default BottomNavBar;
