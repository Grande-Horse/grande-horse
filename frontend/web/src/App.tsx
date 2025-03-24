import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import HomePage from '@/pages';
import Test from '@/pages/Test.tsx';
import Test2 from '@/pages/Test2.tsx';
import StallPage from '@/pages/stall';
import ModalProvider from './components/ui/modal/ModalProvider.tsx';

function App() {
  return (
    <BrowserRouter>
      <GlobalLayout>
        <ModalProvider>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/stall' element={<StallPage />} />
            <Route path='/race' element={<Test2 />} />
          </Routes>
        </ModalProvider>
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
