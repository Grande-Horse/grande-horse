import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import ModalProvider from '@/components/ui/modal/ModalProvider.tsx';
import { AuthContextProvider } from '@/pages/register/AuthContextProvider';
import LandingPage from '@/pages/landing';
import HomePage from '@/pages';
import StallPage from '@/pages/stall';
import MarketPage from '@/pages/market/index.tsx';
import SellPage from '@/pages/market/sell';
import RacetrackPage from '@/pages/racetrack';
import RacetrackRoomPage from '@/pages/racetrack/room';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <GlobalLayout>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <ModalProvider>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/stall' element={<StallPage />} />
                <Route path='/market' element={<MarketPage />} />
                <Route path='/market/sell/:horseId' element={<SellPage />} />
                <Route path='/landing' element={<LandingPage />} />
                <Route path='/racetrack' element={<RacetrackPage />} />
                <Route path='/racetrack/room/:roomid' element={<RacetrackRoomPage />} />
              </Routes>
            </ModalProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
