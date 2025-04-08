import { createContext, useReducer, useContext, useEffect } from 'react';
import { autoLogin, registerUser } from '@/services/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

interface AuthState {
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  user: {
    nickname?: string;
    provider?: 'KAKAO' | 'SSAFY';
  } | null;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_SUCCESS' }
  | { type: 'LOGIN_SUCCESS' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_REQUIRED' }
  | { type: 'REGISTER_SUCCESS' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'NICKNAME_AVAILABLE' };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoggedIn: false,
  isRegistered: false,
  isLoading: false,
  user: null,
  error: null,
};
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGOUT':
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('isRegistered');
      sessionStorage.removeItem('oauthProvider');
      return initialState;
    case 'AUTH_SUCCESS':
      sessionStorage.setItem('isAuthenticated', 'true');
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('isRegistered', 'true');
      return {
        ...state,
        isAuthenticated: true,
        isLoggedIn: true,
        isRegistered: true,
        isLoading: false,
        error: null,
        user: action.payload?.user || state.user,
      };
    case 'REGISTER_REQUIRED':
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('isRegistered', 'false');
      return {
        ...state,
        isAuthenticated: true,
        isRegistered: false,
        isLoading: false,
        error: null,
        user: action.payload?.user || state.user,
      };
    case 'REGISTER_SUCCESS':
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('isRegistered', 'true');
      return {
        ...state,
        isAuthenticated: true,
        isRegistered: true,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  handleOauthRedirect: (provider: string) => Promise<void>;
  handleAutoLogin: () => Promise<void>;
  handleRegister: (nickname: string) => Promise<void>;
  handleLogout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const {data: user} = useUserInfo();

  const { VITE_SSAFY_CLIENT_ID, VITE_SSAFY_REDIRECT_URI, VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URI } = import.meta
    .env;

  const handleOauthRedirect = async (provider: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Provider 저장
      sessionStorage.setItem('oauthProvider', provider);

      if (provider === 'SSAFY') {
        window.location.href = `https://project.ssafy.com/oauth/sso-check?client_id=${VITE_SSAFY_CLIENT_ID}&redirect_uri=${VITE_SSAFY_REDIRECT_URI}&response_type=code`;
      } else if (provider === 'KAKAO') {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${VITE_KAKAO_CLIENT_ID}&redirect_uri=${VITE_KAKAO_REDIRECT_URI}&response_type=code`;
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: '로그인 실패',
      });
      console.error('oauth 로그인 오류:', error);
    }
  };

  // 인증된 상태에서 자동 로그인 시도
  const handleAutoLogin = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await autoLogin();

      if (response) {
        // 로그인 성공 시
        if (response.errorCode === '') {
          dispatch({ 
            type: 'LOGIN_SUCCESS',
          });
        } else {
          // 회원가입 필요 시
          console.log('회원가입 필요');
          dispatch({ 
            type: 'REGISTER_REQUIRED',
          });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: 'SET_ERROR', payload: '자동 로그인 실패' });
      dispatch({ type: 'LOGOUT' });
    }
  };


  const handleRegister = async (nickname: string) => {
    if (!state.isAuthenticated) {
      dispatch({
        type: 'SET_ERROR',
        payload: '사용자 정보가 없습니다',
      });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await registerUser(nickname);
      if (response.errorCode === '') {
        dispatch({
          type: 'NICKNAME_AVAILABLE',
        });
      }

      dispatch({
        type: 'REGISTER_SUCCESS',
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: '회원가입 실패',
      });
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // 초기 인증 상태 확인
  useEffect(() => {
    // 저장된 인증 데이터 확인
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const isRegistered = sessionStorage.getItem('isRegistered') === 'true';
    
    // 저장된 인증 데이터가 있는 경우
    if (isAuthenticated) {
      if (isRegistered && isLoggedIn) {
        dispatch({ type: 'LOGIN_SUCCESS' });
      } else if (isRegistered) {
        dispatch({ type: 'REGISTER_SUCCESS' });
      } else {
        dispatch({ type: 'REGISTER_REQUIRED' });
      }
    } else {
      // 저장된 인증 데이터가 없는 경우
      const provider = sessionStorage.getItem('oauthProvider') || localStorage.getItem('oauthProvider');
      if (provider || location.pathname.includes('oauth')) {
        handleAutoLogin();
      }
    }
  }, []);

  // 인증 상태 변경에 따른 라우트 보호
  useEffect(() => {
    // 이미 마운트되고 상태가 변경된 경우
    if (state.isAuthenticated) {
      if (state.isRegistered) {
        if (state.isLoggedIn) {
          // 로그인 완료 
          const publicRoutes = ['/landing', '/login', '/register'];
          if (  publicRoutes.includes(location.pathname)) {
            // navigate('/', { replace: true });
          }
        } else {
          // 회원가입 완료, 로그인 아직 안된 경우 
          dispatch({ type: 'LOGIN_SUCCESS' }); // 자동 로그인 완료
        }
      } else {
        // 인증 완료, 회원가입 아직 안된 경우
        if (  location.pathname !== '/register') {
          navigate('/register', { replace: true });
        }
      }
    } else {
      // 인증 안된 경우
      const publicRoutes = ['/landing', '/login'];
      if (  !publicRoutes.includes(location.pathname) && location.pathname !== '/') {
        navigate('/landing', { replace: true });
      }
    }
  }, [state.isAuthenticated, state.isRegistered, state.isLoggedIn, location.pathname]);

  const value: AuthContextType = {
    state,
    dispatch,
    handleOauthRedirect,
    handleAutoLogin,
    handleRegister,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;