<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { rankTextColor } from '@/constants/rank';
import { type RankType } from '@/types/horse';

interface Chat {
  id: number;
  userName: string;
  rank: RankType;
  message: string;
}

const chatMockData: Chat[] = [
  { id: 1, userName: '굿필승', rank: 'normal', message: '안녕하세요' },
  { id: 2, userName: '굿굿필승', rank: 'rare', message: '안녕하세요' },
  { id: 3, userName: '런스피드', rank: 'unique', message: '이 방이 핫하다고해서 들어왔습니다.' },
  { id: 1, userName: '굿필승', rank: 'normal', message: '한 마리 더 들어오면 시작할게요.' },
];

const ChatBox: React.FC = () => {
  const [chatContent, setChatContent] = useState<Chat[]>(chatMockData);
  const [message, setMessage] = useState('');
  const ulRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 채팅을 치는 유저 아이디 (캐시되어있는 개인정보 이용)
  const User = {
    id: 1,
    userName: '굿필승',
    rank: 'normal' as RankType,
  };

  const handleEnterOnClick = () => {
    setChatContent((prev) => {
      return [...prev, { ...User, message }];
    });
    setMessage('');
  };

  const handleChatMessageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleEnterOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buttonRef.current?.click();
    }
  };

  useEffect(() => {
    if (ulRef.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }
  }, [chatContent]);

  return (
    <div className='flex flex-1 flex-col gap-3 overflow-auto'>
      <ul
        ref={ulRef}
        className='text-stroke flex flex-1 flex-col gap-3 overflow-auto rounded-2xl bg-white/10 px-5 py-3 inset-shadow-xs inset-shadow-white/10'
      >
        {chatContent.map((chat) => {
          return (
            <li key={`chat ${Math.random()}`} className='flex gap-3'>
              <p className={`${rankTextColor[chat.rank]}`}>{chat.userName}:</p>
              <p className='flex-1'>{chat.message}</p>
            </li>
          );
        })}
      </ul>

      <div className='sticky bottom-0 flex gap-3'>
        <Input
          type='text'
          onChange={handleChatMessageOnChange}
          onKeyDown={handleEnterOnKeyDown}
          placeholder='채팅을 입력하세요'
          value={message}
        />
        <Button variant='primary' ref={buttonRef} onClick={handleEnterOnClick}>
          Enter
        </Button>
=======
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
>>>>>>> 3570e2d28108774cb5e21b27764d9e7bfb4b1b48
      </div>
    </div>
  );
};

export default ChatBox;
