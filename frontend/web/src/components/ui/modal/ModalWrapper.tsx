import ModalPortal from '@/components/ui/modal/ModalPortal';

type ModalWrapperProps = {
  children?: React.ReactNode;
  close: () => void;
};

const ModalWrapper = ({ children }: ModalWrapperProps) => {
  return (
    <ModalPortal>
      <div className='bg-modal z-modal fixed inset-0 flex items-center justify-center'>
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
