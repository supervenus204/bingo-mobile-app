import { create } from 'zustand';
import { getChallengeCategories } from '../services/challenge.service';

export interface ChallengeCategory {
  id: string;
  name: string;
  description: string;
  is_premium: boolean;
}

type CategoriesState = {
  categories: ChallengeCategory[] | null;
  loading: boolean;
  error: string | null;
};

type CategoriesActions = {
  setCategories: (categories: ChallengeCategory[]) => void;
  fetchCategories: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
};
export type CategoriesStore = CategoriesState & CategoriesActions;

const initialState: CategoriesState = {
  categories: null,
  loading: false,
  error: null,
};

export const useCategoriesStore = create<CategoriesStore>()((set, get) => ({
  ...initialState,

  setCategories: (categories: ChallengeCategory[]) => set({ categories }),

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const categories = await getChallengeCategories();

      if (categories && categories.length > 0) {
        set({ categories: categories as ChallengeCategory[] });
      } else {
        set({ error: 'Failed to fetch categories' });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch plans'
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
