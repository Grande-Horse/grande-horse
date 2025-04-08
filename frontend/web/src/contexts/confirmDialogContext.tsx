import React, { createContext, useContext, useState } from 'react';

interface DialogContextProps {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextProps | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return <DialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>{children}</DialogContext.Provider>;
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog은 DialogProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};
