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
};

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  loading: boolean;
  error?: string | null;
};

type AuthActions = {
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (message?: string | null) => void;
  reset: () => void;
  logout: () => void;
};

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
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
      reset: () => set({ ...initialState }),
      logout: () => set({ ...initialState }),
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
    }
  )
);

// Selectors
export const useAuthToken = () => useAuthStore(s => s.token);
export const useAuthUser = () => useAuthStore(s => s.user);
export const useAuthLoading = () => useAuthStore(s => s.loading);
export const useIsAuthenticated = () => useAuthStore(s => s.isAuthenticated);
