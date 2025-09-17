import { create } from 'zustand';
import { Challenge } from '../types/challenge.type';

type ChallengesState = {
  challenges: Challenge[];
  loading: boolean;
  error?: string;

  currentChallenge: Challenge | null;
};

type ChallengesActions = {
  setChallenges: (challenges: Challenge[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentChallenge: (currentChallenge: Challenge) => void;
  reset: () => void;
};

type ChallengesStore = ChallengesState & ChallengesActions;

const initialState: ChallengesState = {
  challenges: [],
  loading: false,
  error: undefined,
  currentChallenge: null,
};

export const useChallengesStore = create<ChallengesStore>(set => ({
  ...initialState,
  setChallenges: (challenges: Challenge[]) => set({ challenges }),
  setLoading: (loading: boolean) => set({ loading }),
  setCurrentChallenge: (currentChallenge: Challenge) =>
    set({ currentChallenge }),
  reset: () => set(initialState),
}));

// Convenience selectors
export const useChallenges = () => useChallengesStore(s => s.challenges);
export const useChallengesLoading = () => useChallengesStore(s => s.loading);
export const useChallengesError = () => useChallengesStore(s => s.error);
