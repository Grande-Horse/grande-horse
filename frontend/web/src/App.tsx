import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GlobalLayout from './layouts/GlobalLayout';
import HomePage from './pages';

function App() {
  return (
    <GlobalLayout>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </GlobalLayout>
  );
}

export default App;
