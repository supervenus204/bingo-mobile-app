import { create } from 'zustand';
import { getPaymentPlans } from '../services/payment.service';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  maxWeek: number;
  maxParticipants: number;
  features: string[];
}

type PlansState = {
  plans: SubscriptionPlan[] | null;
  loading: boolean;
  error: string | null;
};

type PlansActions = {
  setPlans: (plans: SubscriptionPlan[]) => void;
  fetchPlans: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
};

export type PlansStore = PlansState & PlansActions;

const initialState: PlansState = {
  plans: null,
  loading: false,
  error: null,
};

export const usePlansStore = create<PlansStore>()((set, get) => ({
  ...initialState,

  setPlans: (plans: SubscriptionPlan[]) => set({ plans }),

  fetchPlans: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getPaymentPlans();

      if (response.success && response.data) {
        set({ plans: response.data });
      } else {
        set({ error: 'Failed to fetch plans' });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch plans',
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
