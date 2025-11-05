import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type WelcomeScreenState = {
  completedWelcomeScreen: boolean;
  welcomeScreenStep: number;
  hasHydrated: boolean;
};

type WelcomeScreenActions = {
  setWelcomeScreenCompleted: (completed: boolean) => void;
  setWelcomeScreenStep: (step: number) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
};

export type WelcomeScreenStore = WelcomeScreenState & WelcomeScreenActions;

const initialState: WelcomeScreenState = {
  completedWelcomeScreen: false,
  welcomeScreenStep: 0,
  hasHydrated: false,
};

export const useWelcomeScreenStore = create<WelcomeScreenStore>()(
  persist(
    set => ({
      ...initialState,

      setWelcomeScreenStep: (step: number) => {
        set({ welcomeScreenStep: step });
      },

      setWelcomeScreenCompleted: (completed: boolean) => {
        set({ completedWelcomeScreen: completed });
      },

      setHasHydrated: (hydrated: boolean) => {
        set({ hasHydrated: hydrated });
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'welcome-screen-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        completedWelcomeScreen: state.completedWelcomeScreen,
        welcomeScreenStep: state.welcomeScreenStep,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
