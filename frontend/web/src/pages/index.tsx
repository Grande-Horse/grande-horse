import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className='flex w-full flex-col'>
      <Link to='/stall' className='underline'>
        마구간으로 이동
      </Link>
      <Link to='/market' className='underline'>
        마시장으로 이동
      </Link>
    </div>
  );
};

export default HomePage;
