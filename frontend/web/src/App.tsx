import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/App.css';
import GlobalLayout from '@/layouts/GlobalLayout';
import ModalProvider from '@/components/ui/modal/ModalProvider.tsx';
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

// 보호된 라우트 래퍼
const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireAuth requireRegistration>
    {children}
  </ProtectedRoute>
);

// 인증만 필요한 라우트 래퍼
const AuthOnlyPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireAuth requireRegistration={false}>
    {children}
  </ProtectedRoute>
);

// 공개 라우트 래퍼
const PublicPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireAuth={false}>{children}</ProtectedRoute>
);

function App() {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <GlobalLayout>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <ModalProvider>
              <Routes>
                {/* 인증 + 회원가입 필요 */}
                <Route
                  path='/'
                  element={
                    // <ProtectedPage>
                    <HomePage />
                    // </ProtectedPage>
                  }
                />
                <Route
                  path='/stall'
                  element={
                    // <ProtectedPage>
                    <StallPage />
                    // </ProtectedPage>
                  }
                />
                <Route
                  path='/market'
                  element={
                    // <ProtectedPage>
                    <MarketPage />
                    // {/* </ProtectedPage> */}
                  }
                />
                <Route
                  path='/market/sell/:horseId'
                  element={
                    <ProtectedPage>
                      <SellPage />
                    </ProtectedPage>
                  }
                />
                <Route
                  path='/racetrack'
                  element={
                    // <ProtectedPage>
                    <RacetrackPage />
                    // {/* </ProtectedPage> */}
                  }
                />
                <Route
                  path='/racetrack/room/:roomid'
                  element={
                    // <ProtectedPage>
                    <RacetrackRoomPage />
                    // {/* </ProtectedPage> */}
                  }
                />

                {/* 인증 필요 */}
                <Route
                  path='/register'
                  element={
                    <AuthOnlyPage>
                      <RegisterPage />
                    </AuthOnlyPage>
                  }
                />

                {/* 공개 라우트 */}
                <Route
                  path='/landing'
                  element={
                    <PublicPage>
                      <LandingPage />
                    </PublicPage>
                  }
                />

                <Route
                  path='/auth'
                  element={
                    <PublicPage>
                      <AuthPage />
                    </PublicPage>
                  }
                />
              </Routes>
            </ModalProvider>
          </AuthContextProvider>
        </QueryClientProvider>
      </GlobalLayout>
    </BrowserRouter>
  );
}

export default App;
