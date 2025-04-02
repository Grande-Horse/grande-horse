import { checkNicknameDuplicated, registerUser } from '@/services/auth';
import { useState } from 'react';

export interface NicknameResponse {
  data: {
    isDuplicated: boolean;
  };
}

export interface RegisterState {
  nickname: string;
  isNicknameChecked: boolean;
  isNicknameAvailable: boolean | null;
  isLoading: boolean;
  isError: string | null;
  isNetworkError: boolean;
}

const useRegister = () => {
  const [state, setState] = useState<RegisterState>({
    nickname: '',
    isNicknameChecked: false,
    isNicknameAvailable: null,
    isLoading: false,
    isError: null,
    isNetworkError: false,
  });

  const setNickname = (nickname: string) => {
    setState((prev) => ({
      ...prev,
      nickname,
      isError: null,
      isNetworkError: false,
    }));
  };

  const validateNickname = async () => {
    if (!state.nickname) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: null,
      isNetworkError: false,
    }));

    try {
      const response = await checkNicknameDuplicated(state.nickname);
      setState((prev) => ({
        ...prev,
        isNicknameChecked: true,
        isNicknameAvailable: !response,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isNicknameChecked: false,
        isNicknameAvailable: null,
        isLoading: false,
        isError: '닉네임 중복 확인 중 오류가 발생했습니다.',
        isNetworkError: true,
      }));
      return false;
    }
  };

  const submitRegistration = async () => {
    if (!state.isNicknameChecked || !state.isNicknameAvailable) return;

    setState((prev) => ({
      ...prev,
      isLoading: true,
      isError: null,
      isNetworkError: false,
    }));

    try {
      const response = await registerUser(state.nickname);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isError: '회원가입 중 오류가 발생했습니다.',
        isNetworkError: true,
      }));
    }
  };

  return {
    state,
    setNickname,
    validateNickname,
    submitRegistration,
  };
};

export default useRegister;
