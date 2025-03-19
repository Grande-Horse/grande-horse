import { createContext, useContext, useMemo, useState } from 'react';
import * as types from './types';

export const ModalStateContext = createContext<types.Modal[]>([]);
export const ModalDispatchContext = createContext({
  open: (_Component: React.Component, _props: types.ModalProps) => {},
  close: (_Component: React.Component) => {},
});
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

// Modal을 열고 닫을 때 Context내부의 모든 Modal을 리렌더링하지 않도록 열려있는 Modal의 상태와 모달 이벤트를 별도로 관리
export const useModalStateContext = () => useContext(ModalStateContext);
export const useModalDispatchContext = () => useContext(ModalDispatchContext);

function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openedModals, setOpenedModals] = useState<types.Modal[]>([]);

  const open = (Component: React.Component, props: types.ModalProps) => {
    setOpenedModals((modals) => [...modals, { Component, props }]);
  };

  const close = (Component: React.Component) => {
    setOpenedModals((modals) => {
      return modals.filter((modal) => {
        return modal.Component !== Component;
      });
    });
  };

  // dispatch를 매번 재생성하지 않도록 useMemo 사용
  const dispatch = useMemo(() => ({ open, close }), []);

  return (
    <ModalStateContext.Provider value={openedModals}>
      <ModalDispatchContext.Provider value={dispatch}>{children}</ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
}
export default ModalProvider;
