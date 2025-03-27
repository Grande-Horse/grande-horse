import { ReactNode } from 'react';
import Header from '@/components/ui/header/Header';

interface LayoutProps {
  children: ReactNode;
}

const GlobalLayout: React.FC<LayoutProps> = ({ children }) => (
  <div className='bg-background max-w-base font-primary text-body2 m-auto flex min-h-screen flex-col justify-between text-white'>
    <Header />
    <main className='scrollbar-hide flex-1 overflow-x-hidden'>{children}</main>
  </div>
);

export default GlobalLayout;
