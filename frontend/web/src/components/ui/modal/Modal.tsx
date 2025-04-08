import { Button } from '../Button';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({ isOpen, children, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='bg-modal z-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background max-w-modal flex w-full flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
        {children}
      </div>
    </div>
  );
};

export default Modal;
