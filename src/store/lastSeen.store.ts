import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type LastSeenState = {
  lastSeenTimes: Record<string, number>; // { [challengeId]: timestamp }
};

type LastSeenActions = {
  updateLastSeen: (challengeId: string) => void;
  getLastSeen: (challengeId: string) => number | null;
  reset: () => void;
};

export type LastSeenStore = LastSeenState & LastSeenActions;

const initialState: LastSeenState = {
  lastSeenTimes: {},
};

export const useLastSeenStore = create<LastSeenStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateLastSeen: (challengeId: string) => {
        const timestamp = Date.now();
        set(state => ({
          lastSeenTimes: {
            ...state.lastSeenTimes,
            [challengeId]: timestamp,
          },
        }));
      },

      getLastSeen: (challengeId: string) => {
        const state = get();
        return state.lastSeenTimes[challengeId] || null;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'last-seen-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        lastSeenTimes: state.lastSeenTimes,
      }),
    }
  )
);

