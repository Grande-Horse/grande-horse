import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const GlobalLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='bg-background max-w-base font-primary text-body2 m-auto flex min-h-screen text-white'>
      {children}
    </div>
  );
};

export default GlobalLayout;
