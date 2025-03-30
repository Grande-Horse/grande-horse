import { createContext, useReducer, useContext, useEffect } from 'react';
import { autoLogin, oauthLogin, registerUser } from '@/services/auth';

interface AuthState {
  isAuthenticated: boolean;
  isRegistered: boolean;
  user: {
    nickname?: string;
    provider?: 'kakao' | 'ssafy';
  } | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthState['user'] } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTRATION_REQUIRED'; payload: AuthState['user'] }
  | { type: 'REGISTER_SUCCESS'; payload: { user: AuthState['user'] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  isAuthenticated: false,
  isRegistered: false,
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return initialState;
    case 'REGISTRATION_REQUIRED':
      return {
        ...state,
        isAuthenticated: true,
        isRegistered: false,
        user: action.payload.user,
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
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  handleOauthLogin: (provider: string) => Promise<void>;
  handleAutoLogin: () => Promise<void>;
  register: (nickname: string) => Promise<void>;
  logout: () => void;
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

  useEffect(() => {
    handleAutoLogin();
  }, []);

  const handleOauthLogin = async (provider: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await oauthLogin(provider.toLowerCase());

      if (response.isRegistered) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user },
        });
      } else {
        dispatch({
          type: 'REGISTRATION_REQUIRED',
          payload: { user: response.user },
        });
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

      if (response.isRegistered) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user },
        });
      } else {
        dispatch({
          type: 'REGISTRATION_REQUIRED',
          payload: { user: response.user },
        });
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      dispatch({
        type: 'SET_ERROR',
        payload: '자동 로그인 실패',
      });
    }
  };

  const register = async (nickname: string) => {
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

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    state,
    handleOauthLogin,
    handleAutoLogin,
    register,
    logout: () => dispatch({ type: 'LOGOUT' }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
