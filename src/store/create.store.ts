import { create } from 'zustand';
import { BingoCard } from '../types';

const _bingoCardsData = [
  { id: '1', name: '30+ Min Exercise', color: '#82D98B', count: 0 },
  { id: '2', name: 'Drink 2L Water', color: '#dcfce7', count: 0 },
  { id: '3', name: 'Carb-Free Day', color: '#fef3c7', count: 0 },
  { id: '4', name: 'No Sugar All Day', color: '#dcfce7', count: 0 },
  { id: '5', name: 'No Food After 7pm', color: '#fed7aa', count: 0 },
  { id: '6', name: '8 Hours Sleep', color: '#dbeafe', count: 0 },
  { id: '7', name: 'SKIP Dinner', color: '#dcfce7', count: 0 },
  { id: '8', name: 'Eat Mindfully', color: '#E2CCFE', count: 0 },
  { id: '9', name: 'No Bread All Day', color: '#E2CCFE', count: 0 },
  { id: '10', name: '30+ Min Yoga', color: '#fce7f3', count: 0 },
  { id: '11', name: '30+ Min Exercise', color: '#82D98B', count: 0 },
  { id: '12', name: 'Drink 2L Water', color: '#5DA9F9', count: 0 },
  { id: '13', name: 'Carb-Free Day', color: '#fef3c7', count: 0 },
  { id: '14', name: 'No Sugar All Day', color: '#5DA9F9', count: 0 },
];

type CreateState = {
  plan: string;
  title: string;
  isOrganizerParticipant?: boolean;
  duration: number;
  cardSize: number;
  categoryId: string;

  bingoCards: BingoCard[];

  participants: string[];

  loading: boolean;
  error?: string;
};

type CreateActions = {
  setPlan: (plan: string) => void;
  setTitle: (title: string) => void;
  setIsOrganizerParticipant: (isOrganizerParticipant: boolean) => void;
  setDuration: (duration: number) => void;
  setCardSize: (cardSize: number) => void;
  setCategoryId: (categoryId: string) => void;
  setBingoCards: (
    bingoCards: BingoCard[] | ((prev: BingoCard[]) => BingoCard[])
  ) => void;
  setParticipants: (
    participants: string[] | ((prev: string[]) => string[])
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  reset: () => void;
};

type CreateStore = CreateState & CreateActions;

const initialState: CreateState = {
  plan: 'free',
  title: '',
  isOrganizerParticipant: false,
  duration: 1,
  cardSize: 24,
  categoryId: 'fitness',
  bingoCards: [],
  participants: [],
  loading: false,
  error: undefined,
};

export const useCreateStore = create<CreateStore>(set => ({
  ...initialState,
  setPlan: (plan: string) => set({ plan }),
  setTitle: (title: string) => set({ title }),
  setIsOrganizerParticipant: (isOrganizerParticipant: boolean) =>
    set({ isOrganizerParticipant }),
  setDuration: (duration: number) => set({ duration }),
  setCardSize: (cardSize: number) => set({ cardSize }),
  setCategoryId: (categoryId: string) => set({ categoryId }),
  setBingoCards: (
    bingoCards: BingoCard[] | ((prev: BingoCard[]) => BingoCard[])
  ) =>
    set(state => ({
      ...state,
      bingoCards:
        typeof bingoCards === 'function'
          ? bingoCards([...state.bingoCards])
          : [...bingoCards],
    })),
  setParticipants: (participants: string[] | ((prev: string[]) => string[])) =>
    set(state => ({
      ...state,
      participants:
        typeof participants === 'function'
          ? participants([...state.participants])
          : [...participants],
    })),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string) => set({ error }),
  reset: () => set(initialState),
}));
