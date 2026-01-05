import { create } from 'zustand';
import { fetchAllChallenges } from '../services/challenge.service';
import { Challenge } from '../types/challenge.type';

type ChallengesState = {
  ongoingChallenges: Challenge[];
  archivedChallenges: Challenge[];
  selectedChallenge: Challenge | null;
  loading: boolean;
  error?: string;
};

type ChallengesActions = {
  setOngoingChallenges: (
    ongoingChallenges: Challenge[] | ((prev: Challenge[]) => Challenge[])
  ) => void;
  setArchivedChallenges: (archivedChallenges: Challenge[]) => void;
  setLoading: (loading: boolean) => void;
  selectChallenge: (challengeId: string) => void;
  fetchChallenges: (silent?: boolean) => void;
  reset: () => void;
};

type ChallengesStore = ChallengesState & ChallengesActions;

const initialState: ChallengesState = {
  ongoingChallenges: [],
  archivedChallenges: [],
  loading: false,
  error: undefined,
  selectedChallenge: null,
};

export const useChallengesStore = create<ChallengesStore>(set => ({
  ...initialState,
  setOngoingChallenges: (
    ongoingChallenges: Challenge[] | ((prev: Challenge[]) => Challenge[])
  ) =>
    set(state => ({
      ongoingChallenges:
        typeof ongoingChallenges === 'function'
          ? ongoingChallenges(state.ongoingChallenges)
          : ongoingChallenges,
    })),
  setArchivedChallenges: (archivedChallenges: Challenge[]) =>
    set({ archivedChallenges }),
  setLoading: (loading: boolean) => set({ loading }),
  selectChallenge: (challengeId: string) => {
    set(state => ({
      selectedChallenge:
        state.ongoingChallenges.find(
          (challenge: Challenge) => challenge.id === challengeId
        ) ?? null,
    }));
  },
  fetchChallenges: async (silent = false) => {
    if (!silent) {
      set({ loading: true });
    }
    try {
      const challenges = await fetchAllChallenges();
      const ongoingChallenges = challenges.filter(
        (challenge: Challenge) =>
          challenge.status === 'active' ||
          challenge.status === 'pending' ||
          challenge.status === 'unpaid' ||
          challenge.status === 'inactive'
      );
      const archivedChallenges = challenges.filter(
        (challenge: Challenge) => challenge.status === 'finish'
      );
      set({ ongoingChallenges, archivedChallenges });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch challenges',
      });
    } finally {
      if (!silent) {
        set({ loading: false });
      }
    }
  },
  reset: () => set(initialState),
}));
