import { createPortal } from 'react-dom';

const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 서버 환경에서는 null을 반환
  if (typeof window === 'undefined') {
    return null;
  }

  const modalContainer = document.getElementById('modal-container');
  return modalContainer ? createPortal(children, modalContainer) : null;
};

export default Portal;
