import { createContext, useReducer, ReactNode, useContext, useEffect, useRef } from 'react';
import { HorseType } from '@/types/horse';
import { HorseCardType } from '@/types/card';
import { getAllCandidateHorses, putCandidateHorse, setRepresentativeHorse } from '@/services/horseManagement';

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
  | { type: 'TOGGLE_CANDIDATE_HORSE'; payload: HorseCardType }
  | { type: 'TOGGLE_REPRESENTATIVE_HORSE'; payload: HorseCardType | null }
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
      if (state.selectedHorse?.cardId === action.payload.cardId) return { ...state, selectedHorse: null };
      return { ...state, selectedHorse: action.payload };

    case 'TOGGLE_CANDIDATE_HORSE':
      const isAlreadyInPasture = state.candidateHorses.some((horse) => horse.cardId === action.payload.cardId);

      if (isAlreadyInPasture) {
        const updatedHorses = state.candidateHorses.filter((horse) => horse.cardId !== action.payload.cardId);
        const shouldClearRepresentative = state.representativeHorse?.cardId === action.payload.cardId;

        return {
          ...state,
          candidateHorses: updatedHorses,
          representativeHorse: shouldClearRepresentative ? null : state.representativeHorse,
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

    case 'TOGGLE_REPRESENTATIVE_HORSE':
      return {
        ...state,
        candidateHorses: state.candidateHorses.map((h) =>
          h.cardId === action.payload?.cardId ? { ...h, status: 3 } : { ...h, status: h.status === 3 ? 2 : h.status }
        ),
        representativeHorse: action.payload,
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
  fetchCandidateHorses: () => Promise<void>;
  putCandidateHorse: (cardId: number) => void;
}

export const PastureHorseContext = createContext<PastureHorseContextType>({
  state: initialState,
  dispatch: () => {},
  fetchCandidateHorses: async () => {},
  putCandidateHorse: () => {},
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

  const fetchCandidateHorses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await getAllCandidateHorses();
      dispatch({ type: 'INITIALIZE_HORSES', payload: response });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchCandidateHorses();
  }, []);

  return (
    <PastureHorseContext.Provider value={{ state, dispatch, fetchCandidateHorses, putCandidateHorse }}>
      {children}
    </PastureHorseContext.Provider>
  );
};
