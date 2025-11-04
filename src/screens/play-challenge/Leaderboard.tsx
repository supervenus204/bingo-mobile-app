import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Pagination, ProfileIcon } from '../../components/common';
import { getLeaderboard } from '../../services';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  image?: string;
  points: number;
  completedTime?: string;
  position: number;
  badges?: string[];
}

const UserCard: React.FC<{ user: User }> = React.memo(({ user }) => {
  const getPositionBadgeStyle = (position: number) => {
    switch (position) {
      case 1:
        return styles.firstPlaceBadge;
      case 2:
        return styles.secondPlaceBadge;
      case 3:
        return styles.thirdPlaceBadge;
      default:
        return styles.defaultBadge;
    }
  };

  return (
    <TouchableOpacity style={styles.userCard}>
      {user.position <= 3 && (
        <View
          style={[styles.positionBadge, getPositionBadgeStyle(user.position)]}
        >
          <Text style={styles.positionText}>{user.position}</Text>
        </View>
      )}

      <View style={styles.avatarContainer}>
        <ProfileIcon
          image={user.image}
          initialsText={(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
          size={50}
        />
      </View>

      <Text style={styles.userName}>{user.firstName}</Text>

      <View style={styles.pointsContainer}>
        <Text style={styles.points}>{user.points} pts</Text>
      </View>

      {user.completedTime && (
        <Text style={styles.completedTime}>{user.completedTime}</Text>
      )}
    </TouchableOpacity>
  );
});

const UserListItem: React.FC<{ user: User; index: number }> = React.memo(
  ({ user, index }) => {
    return (
      <TouchableOpacity style={styles.listItem}>
        <View style={styles.listItemLeft}>
          <Text style={styles.listPosition}>{index + 1}</Text>
          <View style={styles.listAvatarContainer}>
            <ProfileIcon
              image={user.image}
              initialsText={(user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')}
              size={44}
            />
          </View>
          <Text style={styles.listUserName}>{user.firstName}</Text>
        </View>

        <View style={styles.listItemRight}>
          <Text style={styles.listPoints}>{user.points} pts</Text>
          <Text style={styles.listStatus}>{user.completedTime}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

const pageSize = 5;

export const LeaderboardScreen: React.FC = () => {
  const { selectedChallenge } = useChallengesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const transformLeaderboardData = (data: any) => {
    if (!data || !data.rank) return [];

    const calculatePoints = (currentProgress: string[]) => {
      if (!currentProgress) return 0;
      return currentProgress.filter((item: string) => {
        return item === 'mark' || (typeof item === 'string' && item.includes('T'));
      }).length;
    };

    const isCompleted = (currentProgress: string[]) => {
      if (!currentProgress) return false;
      return currentProgress.every((item: string) => {
        return item === 'mark' || (typeof item === 'string' && item.includes('T'));
      });
    };

    // Reverse to show highest points first (backend sorts ascending)
    const reversedRank = [...data.rank].reverse();

    const transformed = reversedRank.map((item: any, index: number) => {
      if (!item.user) {
        console.warn('User missing in item:', item);
        return null;
      }

      const user = item.user;
      const points = calculatePoints(item.current_progress);
      const completed = isCompleted(item.current_progress);

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        image: user.image,
        points: item.points_earned || points,
        completedTime: item.completion_date || (completed ? 'Completed' : undefined),
        position: index + 1,
        badges: item.awards || [],
      };
    }).filter(Boolean);

    console.log('Transformed data:', transformed);
    return transformed;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching leaderboard for:', selectedChallenge?.id, selectedChallenge?.current_week);
        const leaderboard = await getLeaderboard(selectedChallenge?.id as string, selectedChallenge?.current_week as number);
        console.log('Raw leaderboard response:', leaderboard);
        // apiFetch already returns the data object directly
        const transformedData = transformLeaderboardData(leaderboard);
        console.log('Setting transformed data:', transformedData);
        setLeaderboardData(transformedData);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedChallenge?.id]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(leaderboardData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = leaderboardData.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      paginatedUsers,
    };
  }, [currentPage, leaderboardData]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const topPerformers = useMemo(() => {
    return leaderboardData.slice(0, 5);
  }, [leaderboardData]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : leaderboardData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No participants yet</Text>
          </View>
        ) : (
          <>
            {/* Top Performers Section */}
            <View style={styles.topPerformersSection}>
              <Text style={styles.sectionTitle}>Bingo Completors</Text>
            </View>

            {/* Horizontal User List */}
            {topPerformers.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollHorizontalContainer}
                style={styles.usersList}
              >
                {topPerformers.map((user: any) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </ScrollView>
            )}

            {/* Vertical User List */}
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Participants</Text>
              {paginationData.paginatedUsers.map((user, index) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  index={paginationData.startIndex + index}
                />
              ))}
            </View>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: FONTS.size['2xl'],
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.black,
  },
  inviteButton: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteButtonText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.white,
  },
  topPerformersSection: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.black,
  },
  usersList: {
    paddingVertical: 16,
    marginBottom: 20,
  },
  scrollHorizontalContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: 120,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    flex: 1,
  },
  positionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  firstPlaceBadge: {
    backgroundColor: COLORS.secondary.yellow.mustard,
  },
  secondPlaceBadge: {
    backgroundColor: COLORS.gray.medium,
  },
  thirdPlaceBadge: {
    backgroundColor: COLORS.secondary.orange.web,
  },
  defaultBadge: {
    backgroundColor: COLORS.text.primary,
  },
  positionText: {
    color: COLORS.white,
    fontSize: FONTS.size.xs,
    fontFamily: FONTS.family.poppinsBold,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  userName: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  pointsContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  points: {
    fontSize: FONTS.size.xs,
    color: COLORS.primary.main,
    fontFamily: FONTS.family.poppinsBold,
  },
  completedTime: {
    fontSize: 10,
    color: COLORS.text.secondary,
    fontFamily: FONTS.family.poppinsRegular,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONTS.size.sm,
    color: COLORS.text.secondary,
    fontFamily: FONTS.family.poppinsRegular,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
  },
  listTitle: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray.lightMedium,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listPosition: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.black,
    width: 24,
    marginRight: 12,
  },
  listAvatarContainer: {
    marginRight: 12,
  },
  listUserName: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.text.primary,
    flex: 1,
  },
  listItemRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  listPoints: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.green.forest,
    marginBottom: 2,
  },
  listStatus: {
    fontSize: FONTS.size.xs,
    color: COLORS.text.tertiary,
    fontFamily: FONTS.family.poppinsRegular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: FONTS.size.base,
    color: COLORS.text.secondary,
    fontFamily: FONTS.family.poppinsRegular,
  },
});
