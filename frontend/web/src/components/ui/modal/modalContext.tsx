import { createContext, useContext, useMemo, useState } from 'react';
import Modals from './Modals';

export interface Modal {
  id: string;
  Component: React.ComponentType<ModalProps>;
  props: ModalProps;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id?: string;
  children?: React.ReactNode;
}

interface ModalDispatch {
  open: (Component: React.ComponentType<ModalProps>, props: ModalProps) => string;
  close: (id: string) => void;
}

export const ModalsStateContext = createContext<Modal[]>([]);
export const ModalDispatchContext = createContext<ModalDispatch | null>(null);

// Modal을 열고 닫을 때 Context내부의 모든 Modal을 리렌더링하지 않도록 열려있는 Modal의 상태와 모달 이벤트를 별도로 관리
export const useModalsStateContext = () => useContext(ModalsStateContext);
export const useModalDispatchContext = () => {
  const context = useContext(ModalDispatchContext);
  if (!context) throw new Error('useModalDispatchContext must be used within a ModalProvider');
  return context;
};

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [openedModals, setOpenedModals] = useState<Modal[]>([]);

  const open = (Component: React.ComponentType<ModalProps>, props: ModalProps) => {
    const id = crypto.randomUUID();
    setOpenedModals((modals) => [...modals, { id, Component, props }]);
    return id;
  };

  const close = (id: string) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => modal.id !== id);
    });
  };

  // dispatch를 매번 재생성하지 않도록 useMemo 사용
  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <ModalsStateContext.Provider value={openedModals}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
        <Modals />
      </ModalDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
};

export default ModalProvider;
