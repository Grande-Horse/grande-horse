import { ModalProps } from '@/components/ui/modal/ModalProvider';

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className='bg-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background max-w-modal flex flex-col items-center justify-center rounded-lg px-10 py-14 text-white'>
        {children}
      </div>
    </div>
  );
};

export default Modal;
