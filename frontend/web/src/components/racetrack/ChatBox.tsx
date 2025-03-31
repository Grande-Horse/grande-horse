import { Button } from '../ui/Button';
import Input from '../ui/Input';

const ChatBox: React.FC = () => {
  return (
    <div className='flex flex-1 flex-col gap-5'>
      <div className='flex flex-1 items-center justify-center rounded-2xl bg-white/10 inset-shadow-xs inset-shadow-white/10'>
        채팅
      </div>
      <div className='flex gap-3'>
        <Input />
        <Button variant='primary'>Enter</Button>
      </div>
    </div>
  );
};

export default ChatBox;
