import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import HomePage from '@/pages';

function App() {
  return (
    <BrowserRouter>
      <GlobalLayout>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
