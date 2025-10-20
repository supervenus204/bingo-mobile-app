import { create } from 'zustand';
import { getAllBingoCards } from '../services/challenge.service';

export interface BingoCard {
  id: string;
  name: string;
  color: string;
  type?: string;
}

type CardsState = {
  cards: Record<string, BingoCard[]>;
  loading: boolean;
  error: string | null;
};

type CardsActions = {
  setCards: (challengeId: string, cards: BingoCard[]) => void;
  fetchCards: (categoryId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
};
export type CardsStore = CardsState & CardsActions;

const initialState: CardsState = {
  cards: {},
  loading: false,
  error: null,
};

export const useCardsStore = create<CardsStore>()((set, get) => ({
  ...initialState,

  setCards: (categoryId: string, cards: BingoCard[]) => set(state => ({ ...state, cards: { ...state.cards, [categoryId]: cards } })),

  fetchCards: async (categoryId: string) => {
    try {
      set({ loading: true, error: null });
      const bingoCards = await getAllBingoCards(categoryId as string);

      if (bingoCards) {
        set(state => ({ ...state, cards: { ...state.cards, [categoryId]: bingoCards } }));
      } else {
        set({ error: 'Failed to fetch cards' });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cards'
      });
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ ...initialState }),
}));
