import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {COLORS} from '../theme';

export type ThemeType = 'primary' | 'secondary';

interface ThemeState {
  currentTheme: ThemeType;
  colors: typeof COLORS.primary | typeof COLORS.secondary;
}

interface ThemeActions {
  setTheme: (theme: ThemeType) => void;
  switchTheme: () => void;
  resetTheme: () => void;
}

interface ThemeStore extends ThemeState, ThemeActions {}

const initialState: ThemeState = {
  currentTheme: 'primary',
  colors: COLORS.primary,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTheme: (theme: ThemeType) => {
        set({
          currentTheme: theme,
          colors: COLORS[theme],
        });
      },
      switchTheme: () => {
        const {currentTheme} = get();
        const newTheme: ThemeType =
          currentTheme === 'primary' ? 'secondary' : 'primary';
        set({
          currentTheme: newTheme,
          colors: COLORS[newTheme],
        });
      },
      resetTheme: () => {
        set(initialState);
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        currentTheme: state.currentTheme,
        colors: COLORS[state.currentTheme],
      }),
    },
  ),
);

// Optimized selector hooks with stable references
export const useCurrentTheme = () => useThemeStore(state => state.currentTheme);
export const useThemeColors = () => useThemeStore(state => state.colors);

// Memoized actions to prevent recreation
const themeActions = {
  setTheme: useThemeStore.getState().setTheme,
  switchTheme: useThemeStore.getState().switchTheme,
  resetTheme: useThemeStore.getState().resetTheme,
};

export const useThemeActions = () => themeActions;
