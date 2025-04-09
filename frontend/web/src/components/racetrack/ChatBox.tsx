import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useStompClient } from '@/contexts/StompContext';
import { rankTextColor } from '@/constants/rank';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

interface Chat {
  sender: string;
  message: string;
  time: string;
}

interface ChatBoxProps {
  roomId: number;
  chatContent: Chat[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ roomId, chatContent }) => {
  const { data } = useUserInfo();
  const [message, setMessage] = useState('');
  const ulRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const rankKey = data?.representativeCard.horseRank ?? 'all';

  const { publish } = useStompClient();

  const handleEnterOnClick = () => {
    publish(`/app/race_room/${roomId}/chat`, message);
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
          const isSystem = chat.sender === 'SYSTEM';

          return (
            <li key={`chat ${Math.random()}`} className='flex gap-3'>
              <p className={isSystem ? '' : rankTextColor[rankKey]}>{chat.sender}:</p>
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
      </div>
    </div>
  );
};

export default ChatBox;
