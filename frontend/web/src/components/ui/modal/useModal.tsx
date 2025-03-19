import { ReactNode, useCallback } from 'react';
import Modal from './Modal';
import { MenuButton } from '../Button';
import { useModalDispatchContext } from './ModalProvider';

interface ModalOptions {
  title?: string;
  content: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const useModal = () => {
  const { open, close } = useModalDispatchContext();

  const openModal = useCallback(
    ({ title, content, onConfirm, onCancel, confirmText = '확인', cancelText = '취소' }: ModalOptions) => {
      const id = open(Modal, {
        isOpen: true,
        onClose: () => close(id),
        children: (
          <>
            {title && <h2 className='mb-4 text-lg font-bold'>{title}</h2>}

            <div>{content}</div>

            <div className='mt-4 flex gap-2'>
              <MenuButton
                variant='secondary'
                onClick={() => {
                  if (onCancel) onCancel();
                  close(id);
                }}
              >
                {cancelText}
              </MenuButton>
              <MenuButton
                onClick={() => {
                  if (onConfirm) onConfirm();
                  close(id);
                }}
              >
                {confirmText}
              </MenuButton>
            </div>
          </>
        ),
      });

      return id;
    },
    [open, close]
  );

  return { openModal, closeModal: close };
};

export default useModal;
