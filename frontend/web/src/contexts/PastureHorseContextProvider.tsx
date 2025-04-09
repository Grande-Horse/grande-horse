import { createContext, useReducer, ReactNode, useContext, useEffect } from 'react';
import { HorseType } from '@/types/horse';
import { HorseCardType } from '@/types/card';
import { putCandidateHorse, setRepresentativeHorse } from '@/services/horseManagement';

interface PastureHorseState {
  selectedHorse: HorseCardType | null;
  candidateHorses: HorseCardType[];
  representativeHorse: HorseCardType | null;
  isLoading: boolean;
  error: string | null;
  maxHorses: number;
}
type PastureHorseAction =
  | { type: 'SELECT_HORSE'; payload: HorseCardType | null }
  | { type: 'SET_CANDIDATE_HORSES'; payload: HorseCardType }
  | { type: 'SET_REPRESENTATIVE_HORSE'; payload: HorseCardType | null }
  | { type: 'MOVE_HORSE_TO_CANDIDATE'; payload: HorseCardType }
  | { type: 'MOVE_HORSE_TO_PASTURE'; payload: HorseCardType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'INITIALIZE_HORSES'; payload: HorseCardType[] };

const initialState: PastureHorseState = {
  selectedHorse: null,
  candidateHorses: [],
  representativeHorse: null,
  isLoading: false,
  error: null,
  maxHorses: 6,
};

const pastureHorseReducer = (state: PastureHorseState, action: PastureHorseAction): PastureHorseState => {
  switch (action.type) {
    case 'SELECT_HORSE':
      if (!action.payload) return { ...state, selectedHorse: null };
      if (state.selectedHorse?.horseId === action.payload.horseId) return { ...state, selectedHorse: null };
      return { ...state, selectedHorse: action.payload };

    case 'SET_CANDIDATE_HORSES':
      const isAlreadyInPasture = state.candidateHorses.some((horse) => horse.horseId === action.payload.horseId);

      if (isAlreadyInPasture) {
        return {
          ...state,
          candidateHorses: state.candidateHorses.filter((horse) => horse.horseId !== action.payload.horseId),
          error: null,
        };
      } else {
        if (state.candidateHorses.length >= state.maxHorses) {
          return {
            ...state,
            error: `후보 말은 ${state.maxHorses}마리까지만 추가할 수 있습니다.`,
          };
        }

        return {
          ...state,
          candidateHorses: [...state.candidateHorses, action.payload],
          error: null,
        };
      }

    case 'SET_REPRESENTATIVE_HORSE':
      if (state.representativeHorse?.horseId === action.payload?.horseId) {
        return { ...state, representativeHorse: null };
      } else {
        return { ...state, representativeHorse: action.payload };
      }

    case 'MOVE_HORSE_TO_PASTURE':
      if (state.candidateHorses.length >= state.maxHorses) {
        return {
          ...state,
          error: `후보 말은 ${state.maxHorses}마리까지만 추가할 수 있습니다.`,
        };
      }

      return {
        ...state,
        candidateHorses: [...state.candidateHorses, action.payload],
        representativeHorse: null,
        error: null,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'INITIALIZE_HORSES':
      return { ...state, candidateHorses: action.payload, isLoading: false, error: null };

    default:
      return state;
  }
};

interface PastureHorseContextType {
  state: PastureHorseState;
  dispatch: React.Dispatch<PastureHorseAction>;
  fetchHorses: () => Promise<void>;
  addHorseToPasture: (horse: HorseType) => void;
  removeHorseFromPasture: (horseId: string) => void;
}

export const PastureHorseContext = createContext<PastureHorseContextType>({
  state: initialState,
  dispatch: () => null,
  fetchHorses: async () => {},
  addHorseToPasture: () => {},
  removeHorseFromPasture: () => {},
});

export const usePastureHorse = () => {
  const context = useContext(PastureHorseContext);
  if (!context) {
    throw new Error('PastureHorseContext를 찾을 수 없습니다.');
  }
  return context;
};

export const PastureHorseContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(pastureHorseReducer, initialState);

  const fetchHorses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // API 호출 예시
      const response = await fetch('/api/horses');
      if (!response.ok) {
        throw new Error('말 데이터를 불러오는데 실패했습니다.');
      }

      const horses = await response.json();
      dispatch({ type: 'INITIALIZE_HORSES', payload: horses });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addHorseToPasture = (horse: HorseType) => {
    if (state.candidateHorses.length >= state.maxHorses) {
      dispatch({
        type: 'SET_ERROR',
        payload: `후보 말은 ${state.maxHorses}마리까지만 추가할 수 있습니다.`,
      });
      return;
    }

    const isAlreadyInPasture = state.candidateHorses.some((h) => h.horseId === horse.horseId);
    if (isAlreadyInPasture) {
      dispatch({
        type: 'SET_ERROR',
        payload: '이미 마당에 있는 말입니다.',
      });
      return;
    }

    dispatch({ type: 'SET_CANDIDATE_HORSES', payload: { ...horse, cardId: parseInt(horse.horseId, 10), status: 0 } });
  };

  const removeHorseFromPasture = (horseId: string) => {
    const updatedHorses = state.candidateHorses.filter((horse) => horse.horseId !== horseId);
    dispatch({ type: 'INITIALIZE_HORSES', payload: updatedHorses });
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchHorses();
  }, []);

  // candidateHorses 상태가 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    state.candidateHorses.forEach((horse) => {
      putCandidateHorse(horse.cardId);
    });
  }, [state.candidateHorses]);

  // representativeHorse 상태가 변경될 때마다 실행
  useEffect(() => {
    console.log(state.representativeHorse);
    if (state.representativeHorse) {
      setRepresentativeHorse(state.representativeHorse.cardId);
    }
  }, [state.representativeHorse]);

  return (
    <PastureHorseContext.Provider value={{ state, dispatch, fetchHorses, addHorseToPasture, removeHorseFromPasture }}>
      {children}
    </PastureHorseContext.Provider>
  );
};
