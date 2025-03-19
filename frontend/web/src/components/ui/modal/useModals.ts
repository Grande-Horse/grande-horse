import { ModalProps, useModalDispatchContext } from './modalContext';

const useModals = () => {
  const { open, close } = useModalDispatchContext();

  const openModal = (Component: React.ComponentType<ModalProps>, props: ModalProps) => {
    return open(Component, props);
  };
  const closeModal = (id: string) => {
    close(id);
  };

  return {
    openModal,
    closeModal,
  };
};

export default useModals;
