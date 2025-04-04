import ModalPortal from '@/components/ui/modal/ModalPortal';
import { useEffect } from 'react';

type ModalWrapperProps = {
  children?: React.ReactNode;
  close: () => void;
};

const ModalWrapper = ({ children, close }: ModalWrapperProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [close]);

  return (
    <ModalPortal>
      <div
        className='bg-modal z-modal fixed inset-0 flex items-center justify-center'
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
      >
        <div
          className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default ModalWrapper;
