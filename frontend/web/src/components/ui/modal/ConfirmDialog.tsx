import Portal from '@/components/ui/Portal';
import { useDialog } from '@/contexts/confirmDialogContext';
import { Button } from '@/components/ui/Button';

interface ConfirmDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ children, onConfirm, confirmText = '확인' }) => {
  const { closeDialog } = useDialog();

  return (
    <Portal>
      <div className='bg-modal z-modal absolute top-0 flex h-screen w-full items-center justify-center'>
        <div className='bg-background w-modal flex flex-col items-center justify-center rounded-sm p-4 py-10'>
          <section className='text-white'>{children}</section>
          <div className='text-body2 flex gap-3 pt-4'>
            <Button onClick={closeDialog} variant='secondary'>
              취소
            </Button>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ConfirmDialog;
