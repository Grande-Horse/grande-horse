import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import { AuthContextProvider } from '@/pages/auth/AuthContextProvider';
import LandingPage from '@/pages/landing';
import HomePage from '@/pages';
import StallPage from '@/pages/stall';
import MarketPage from '@/pages/market/index.tsx';
import SellPage from '@/pages/market/sell';
import RacetrackPage from '@/pages/racetrack';
import RacetrackRoomPage from '@/pages/racetrack/room';
import RegisterPage from '@/pages/register';
import AuthPage from '@/pages/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PastureHorseContextProvider } from './contexts/PastureHorseContextProvider';
import { StompProvider } from '@/contexts/StompContext';
import { MusicProvider } from '@/contexts/musicContext';
import CardResultPage from './pages/market/cardResult';
import RaceTrackRacePage from '@/pages/racetrack/room/race';
import { HorseProvider } from '@/contexts/pastureHorseContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 인증만 필요한 라우트 래퍼
// const AuthOnlyPage = ({ children }: { children: React.ReactNode }) => (
//   <ProtectedRoute requireAuth requireRegistration={false}>
//     {children}
//   </ProtectedRoute>
// );

// 공개 라우트 래퍼
// const PublicPage = ({ children }: { children: React.ReactNode }) => (
//     <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
// );

function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <MusicProvider>
          <StompProvider>
            <GlobalLayout>
              <AuthContextProvider>
                <HorseProvider>
                  <PastureHorseContextProvider>
                    <Routes>
                      {/* 인증 + 회원가입 필요 */}
                      <Route element={<ProtectedRoute requireAuth requireRegistration />}>
                        <Route path='/' element={<HomePage />} />

                        <Route path='/stall' element={<StallPage />} />
                        <Route path='/market' element={<MarketPage />} />
                        <Route path='/market/card/result' element={<CardResultPage />} />
                        <Route path='/market/sell' element={<SellPage />} />

                        <Route path='/racetrack' element={<RacetrackPage />} />
                        <Route path='/racetrack/room/:roomId' element={<RacetrackRoomPage />} />
                        <Route path='/racetrack/room/:roomId/race' element={<RaceTrackRacePage />} />
                      </Route>

                      {/* 인증 필요 */}
                      {/* <Route element={<ProtectedRoute requireAuth />}> */}
                      <Route path='/register' element={<RegisterPage />} />
                      {/* </Route> */}

                      {/* 공개 라우트 */}
                      <Route element={<ProtectedRoute requireAuth={false} />}>
                        <Route path='/auth' element={<AuthPage />} />
                        <Route path='/landing' element={<LandingPage />} />
                      </Route>
                    </Routes>
                  </PastureHorseContextProvider>
                </HorseProvider>
              </AuthContextProvider>
            </GlobalLayout>
          </StompProvider>
        </MusicProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
