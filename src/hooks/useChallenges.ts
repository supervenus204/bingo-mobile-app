import { useEffect } from 'react';
import { fetchAllChallenges } from '../services/challenge.service';
import { useChallengesStore } from '../store/challenges.store';

type Options = {
  auto?: boolean; // auto fetch on mount
};

export const useChallenges = (options?: Options) => {
  const { challenges, loading, error, setChallenges, setLoading } =
    useChallengesStore();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const challenges = await fetchAllChallenges();
        setChallenges(challenges);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (options?.auto) {
      fetchChallenges();
    }
  }, [options?.auto]);

  return { challenges, loading, error };
};
