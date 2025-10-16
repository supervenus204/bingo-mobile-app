import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingState = {
  hasCompletedOnboarding: boolean;
  onboardingStep: number;
  loading: boolean;
};

type OnboardingActions = {
  setOnboardingCompleted: (completed: boolean) => void;
  setOnboardingStep: (step: number) => void;
  reset: () => void;
};

export type OnboardingStore = OnboardingState & OnboardingActions;

const initialState: OnboardingState = {
  hasCompletedOnboarding: false,
  onboardingStep: 0,
  loading: false,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,

      setOnboardingStep: (step: number) => {
        set({ onboardingStep: step });
      },

      setOnboardingCompleted: (completed: boolean) => {
        set({ hasCompletedOnboarding: completed });
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        onboardingStep: state.onboardingStep,
      }),
    }
  )
);
