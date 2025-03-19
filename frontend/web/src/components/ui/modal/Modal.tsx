import { ModalProps } from './modalContext';

export const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='bg-modal fixed inset-0 flex items-center justify-center'>
      <div className='bg-background w-modal flex flex-col items-center justify-center rounded-lg p-6 shadow-lg'>
        {children}

        <div>
          <button className='bg-secondary mt-4 rounded border-black p-2 text-black' onClick={onClose}>
            취소
          </button>
          <button className='bg-primary mt-4 rounded border-black p-2 text-white' onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
