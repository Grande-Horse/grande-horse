import { ModalProps } from '@/components/ui/modal/ModalProvider';
import { Button } from '../Button';

const Modal: React.FC<ModalProps> = ({ isOpen, children, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='bg-modal z-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
        {children}
        <Button onClick={onConfirm}>확인</Button>
        <Button onClick={onClose}>닫기</Button>
      </div>
    </div>
  );
};

export default Modal;
