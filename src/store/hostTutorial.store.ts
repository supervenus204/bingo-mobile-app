import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type HostTutorialState = {
  completedCardSetupTutorial: boolean;
  completedWhatsNextTutorial: boolean;
  hasHydrated: boolean;
};

type HostTutorialActions = {
  setCardSetupTutorialCompleted: (completed: boolean) => void;
  setWhatsNextTutorialCompleted: (completed: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
};

export type HostTutorialStore = HostTutorialState & HostTutorialActions;

const initialState: HostTutorialState = {
  completedCardSetupTutorial: false,
  completedWhatsNextTutorial: false,
  hasHydrated: false,
};

export const useHostTutorialStore = create<HostTutorialStore>()(
  persist(
    set => ({
      ...initialState,

      setCardSetupTutorialCompleted: (completed: boolean) => {
        set({ completedCardSetupTutorial: completed });
      },

      setWhatsNextTutorialCompleted: (completed: boolean) => {
        set({ completedWhatsNextTutorial: completed });
      },

      setHasHydrated: (hydrated: boolean) => {
        set({ hasHydrated: hydrated });
      },

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'host-tutorial-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        completedCardSetupTutorial: state.completedCardSetupTutorial,
        completedWhatsNextTutorial: state.completedWhatsNextTutorial,
      }),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
