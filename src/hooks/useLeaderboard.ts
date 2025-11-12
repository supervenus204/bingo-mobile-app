import { useCallback, useState } from 'react';
import { getLeaderboard } from '../services';
import { LeaderboardEntry } from '../types';

const convertLeaderboardData = (data: any) => {
  if (!data) return null;

  return data.map((item: any) => ({
    id: item.id,
    points: item.points_earned,
    awards: item.awards,
    loss: item.loss,
    user: {
      id: item.user.id,
      firstName: item.user.first_name,
      lastName: item.user.last_name,
      displayName: item.user.display_name,
      image: item.user.image,
    },
  }));
};

export const useLeaderboard = (challengeId: string) => {
  const [loading, setLoading] = useState(false);
  const [weekLeaderboardData, setWeekLeaderboardData] = useState<
    LeaderboardEntry[] | null
  >(null);
  const [challengeLeaderboardData, setChallengeLeaderboardData] = useState<
    LeaderboardEntry[] | null
  >(null);

  const fetchLeaderboard = useCallback(
    async (weekNumber: number, measureType: 'points' | 'weight' = 'points') => {
      if (!challengeId) return;

      try {
        setLoading(true);
        const response = await getLeaderboard(
          challengeId,
          weekNumber,
          measureType
        );
        setWeekLeaderboardData(
          convertLeaderboardData(response?.weekLeaderboard)
        );
        setChallengeLeaderboardData(
          convertLeaderboardData(response?.challengeLeaderboard)
        );
      } catch (error) {
        setWeekLeaderboardData(null);
        setChallengeLeaderboardData(null);
      } finally {
        setLoading(false);
      }
    },
    [challengeId]
  );

  return {
    weekLeaderboardData,
    challengeLeaderboardData,
    loading,
    fetchLeaderboard,
  };
};
