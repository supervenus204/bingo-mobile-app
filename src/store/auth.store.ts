import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  timezone?: string;
  pushReminders?: boolean;
  image?: string | null;
  country?: string | null;
  activated?: boolean;
};

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  loading: boolean;
  error?: string | null;
  hasHydrated: boolean;
};

type AuthActions = {
  setAuthenticated: (authenticated: boolean) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (message?: string | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
};

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
  hasHydrated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: Boolean(token) });
      },
      setRefreshToken: (refreshToken: string | null) => set({ refreshToken }),
      setUser: (user: AuthUser | null) => set({ user }),
      setAuthenticated: (authenticated: boolean) =>
        set({ isAuthenticated: authenticated }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (message?: string | null) => set({ error: message ?? null }),
      setHasHydrated: (hydrated: boolean) => {
        set({ hasHydrated: hydrated });
      },
      reset: () =>
        set({
          ...initialState,
          hasHydrated: true,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
