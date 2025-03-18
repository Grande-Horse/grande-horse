import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import HomePage from '@/pages';
import StallPage from '@/pages/stall';

function App() {
  return (
    <BrowserRouter>
      <GlobalLayout>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/stall' element={<StallPage />} />
        </Routes>
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
