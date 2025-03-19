import { useContext } from 'react';
import { ModalsStateContext } from './modalContext';

// 앱 내의 Modal리스트를 전역 상태롸 관리 및 실제 화면에 렌더링
const ContextModals = () => {
  const openedModals = useContext(ModalsStateContext);

  return (
    <>
      {openedModals.map(({ id, Component, props }) => (
        <Component key={id} {...props} />
      ))}
    </>
  );
};

export default ContextModals;
