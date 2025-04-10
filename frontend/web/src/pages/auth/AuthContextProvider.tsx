import { createContext, useReducer, useContext, useEffect } from 'react';
import { autoLogin, checkNicknameDuplicated, registerUser } from '@/services/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserInfo from '@/hooks/useQueries/useUserInfo';

interface AuthState {
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  isNicknameAvailable: boolean;
  handleRegister: (nickname: string) => Promise<void>;
  checkNickname: (nickname: string) => Promise<boolean>;
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
  | { type: 'REGISTER_FAILED' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'NICKNAME_AVAILABLE'; payload: string }
  | { type: 'NICKNAME_UNAVAILABLE'; payload: string };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isLoggedIn: false,
  isRegistered: false,
  isNicknameAvailable: false,
  handleRegister: () => Promise.resolve(),
  checkNickname: () => Promise.resolve(false),
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
    case 'NICKNAME_UNAVAILABLE':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
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

    case 'REGISTER_FAILED':
      return {
        ...state,
        isAuthenticated: true,
        isRegistered: false,
        isLoading: false,
        error: action.payload,
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
  handleRegister: (nickname: string) => Promise<boolean | void>; // 반환 타입 변경
  handleLogout: () => void;
  checkNickname: (nickname: string) => Promise<boolean>; // 새로 추가
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
  const { data: user } = useUserInfo();

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
      await autoLogin().then(() => {
        dispatch({ type: 'LOGIN_SUCCESS' });
        handleOauthRedirect(sessionStorage.getItem('oauthProvider') || '').catch((error) => {
          dispatch({ type: 'SET_ERROR', payload: '자동 로그인 실패' });
          dispatch({
            type: 'REGISTER_REQUIRED',
          });
        });
      });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'SET_ERROR', payload: '자동 로그인 실패' });
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkNickname = async (nickname: string) => {
    if (!nickname) {
      dispatch({
        type: 'SET_ERROR',
        payload: '닉네임을 입력해주세요',
      });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const isDuplicated = await checkNicknameDuplicated(nickname);

      if (!isDuplicated) {
        dispatch({ type: 'NICKNAME_AVAILABLE', payload: nickname });
        return true;
      } else {
        dispatch({
          type: 'NICKNAME_UNAVAILABLE',
          payload: '이미 사용중인 닉네임입니다',
        });
        return false;
      }
    } catch (error) {
      let errorMessage = '닉네임 확인 중 오류가 발생했습니다';

      if (error.response?.data?.errorCode === 'C1') {
        errorMessage = '3자 이상 10자 이하로 입력해 주세요.';
      }

      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      return false;
    }
  };

  //
  const handleRegister = async (nickname: string) => {
    if (!state.isAuthenticated) {
      dispatch({
        type: 'SET_ERROR',
        payload: '사용자 정보가 없습니다',
      });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await registerUser(nickname);

      if (response.isSuccess) {
        // 회원가입 성공 후 자동 로그인 시도
        await handleAutoLogin();
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: response.errorCode || '회원가입 실패',
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 실패';
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage,
      });
      return false;
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


  const value: AuthContextType = {
    state,
    dispatch,
    handleOauthRedirect,
    checkNickname,
    handleAutoLogin,
    handleRegister: async (nickname: string) => {
      return await handleRegister(nickname);
    },
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;