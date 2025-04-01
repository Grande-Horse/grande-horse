import { createContext, useReducer, useContext, useEffect } from 'react';
import { autoLogin, oauthLogin, registerUser } from '@/services/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isRegistered: boolean;
  user: {
    nickname?: string;
    provider?: 'KAKAO' | 'SSAFY';
  } | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthState['user'] } }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthState['user'] } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_REQUIRED'; payload: AuthState['user'] }
  | { type: 'REGISTER_SUCCESS'; payload: { user: AuthState['user'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoggedIn: false,
  isRegistered: false,
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return initialState;
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoggedIn: false,
        user: action.payload?.user || null,
        loading: false,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoggedIn: true,
        user: action.payload?.user || null,
        loading: false,
        error: null,
      }
    case 'REGISTER_REQUIRED':
      return {
        ...state,
        isAuthenticated: true,
        isRegistered: false,
        user: action.payload?.user || null,
        loading: false,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isRegistered: true,
        user: action.payload.user,
        loading: false,
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

  const { VITE_SSAFY_CLIENT_ID, VITE_SSAFY_REDIRECT_URI, VITE_KAKAO_CLIENT_ID, VITE_KAKAO_REDIRECT_URI } = import.meta
    .env;

  const handleOauthRedirect = async (provider: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

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

const handleAutoLogin = async () => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await autoLogin();

    if (response.data?.user) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.data.user },
      });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  } catch (error) {
    dispatch({ type: 'LOGOUT' });
  }
};
  useEffect(() => {
    const provider = sessionStorage.getItem('oauthProvider');
    if (provider) {
      handleAutoLogin();
    }
  }, []);

  const handleRegister = async (nickname: string) => {
    if (!state.user) {
      dispatch({
        type: 'SET_ERROR',
        payload: '사용자 정보가 없습니다',
      });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await registerUser(nickname);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: {
            nickname,
            provider: state.user.provider,
          },
        },
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
