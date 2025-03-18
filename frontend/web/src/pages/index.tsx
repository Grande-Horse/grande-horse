import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className='w-full'>
      <Link to='/stall' className='underline'>
        마구간으로 이동
      </Link>
    </div>
  );
};

export default HomePage;
