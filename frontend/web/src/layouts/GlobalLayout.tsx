import Header from '@/components/ui/header/Header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const GlobalLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='bg-background max-w-base font-primary text-body2 m-auto min-h-screen flex-col text-white'>
      <Header />
      {children}
    </div>
  );
};

export default GlobalLayout;
