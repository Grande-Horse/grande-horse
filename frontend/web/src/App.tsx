import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import HomePage from '@/pages';
import StallPage from '@/pages/stall';
import ModalProvider from '@/components/ui/modal/ModalProvider.tsx';
import MarketPage from '@/pages/market/index.tsx';
import SellPage from '@/pages/market/sell';
import LandingPage from './pages/landing';
import RegisterPage from './pages/register';
import RacetrackPage from '@/pages/racetrack';
import RacetrackRoomPage from './pages/racetrack/room';

function App() {
  return (
    <BrowserRouter>
      <GlobalLayout>
        <ModalProvider>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/stall' element={<StallPage />} />
            <Route path='/market' element={<MarketPage />} />
            <Route path='/market/sell' element={<SellPage />} />
            <Route path='/landing' element={<LandingPage />} />
            <Route path='/racetrack' element={<RacetrackPage />} />
            <Route path='/racetrack/room/:roomid' element={<RacetrackRoomPage />} />
          </Routes>
        </ModalProvider>
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
