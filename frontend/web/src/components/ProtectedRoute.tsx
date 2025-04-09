import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/pages/auth/AuthContextProvider';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

interface ProtectedRouteProps {
  requireAuth?: boolean;
  requireRegistration?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAuth = true, requireRegistration = false }) => {
  const { state } = useAuth();
  const { data: user } = useUserInfo();
  const location = useLocation();

  // 로딩 시
  if (state.isLoading) return <div>Loading...</div>;

  // 인증이 필요한 페이지에서 인증되지 않은 경우
  if (!user && requireAuth && !state.isAuthenticated)
    return <Navigate to='/landing' state={{ from: location }} replace />;

  // 인증된 사용자가 회원가입이 필요한 경우
  if (requireRegistration && state.isAuthenticated && !state.isRegistered) return <Navigate to='/register' replace />;

  // 이미 인증/회원가입이 완료된 사용자가 로그인/회원가입 페이지 접근 시도
  if (user && !requireAuth && state.isAuthenticated && state.isRegistered) return <Navigate to='/' replace />;

  // 모든 조건을 통과한 경우
  return <Outlet />;
};
