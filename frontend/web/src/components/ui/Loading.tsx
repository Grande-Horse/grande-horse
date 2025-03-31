import { ClipLoader } from 'react-spinners';

const Loading: React.FC = () => {
  return (
    <div className='flex h-full w-full items-center justify-center p-5'>
      <ClipLoader color='#3D4B63' />
    </div>
  );
};

export default Loading;
