import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  CustomButton,
  LoadingCard,
  ProfileIcon,
} from '../../components/common';
import { PointWeekCard, WeightWeekCard } from '../../components/play-challenge';
import { AWARDS } from '../../constants';
import { useLeaderboard } from '../../hooks';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { LeaderboardEntry } from '../../types';

type MeasureType = 'points' | 'weight';

const getUserInitials = (user: LeaderboardEntry['user']): string => {
  const firstName = user.firstName?.[0] || '';
  const lastName = user.lastName?.[0] || '';
  return (firstName + lastName).toUpperCase() || 'U';
};

const getUserName = (user: LeaderboardEntry['user']): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.displayName || 'User';
};

const WeekSection = ({
  measureType,
  leaderboardData,
  currentWeek,
  selectedWeek,
  setSelectedWeek,
}: {
  measureType: MeasureType;
  leaderboardData: LeaderboardEntry[];
  currentWeek: number;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
}) => {
  const goToPreviousWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
    }
  };
  const goToNextWeek = () => {
    if (selectedWeek < currentWeek - 1) {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  const disablePreviousWeek = useMemo(() => selectedWeek <= 1, [selectedWeek]);
  const disableNextWeek = useMemo(
    () => selectedWeek >= currentWeek - 1,
    [selectedWeek, currentWeek]
  );

  return (
    <View style={styles.section}>
      <View style={styles.weekContainer}>
        <CustomButton
          icon={
            <Icon
              name="chevron-left"
              size={24}
              color={
                disablePreviousWeek
                  ? COLORS.primary.white
                  : COLORS.gray.veryDark
              }
            />
          }
          buttonStyle={styles.weekButton}
          textStyle={styles.weekButtonText}
          onPress={goToPreviousWeek}
          disabled={disablePreviousWeek}
        />
        <Text style={styles.weekText}>
          {measureType === 'points' ? 'Winner' : 'Biggest Loser'} - Week{' '}
          {selectedWeek}
        </Text>
        <CustomButton
          icon={
            <Icon
              name="chevron-right"
              size={24}
              color={
                disableNextWeek ? COLORS.primary.white : COLORS.gray.veryDark
              }
            />
          }
          buttonStyle={styles.weekButton}
          textStyle={styles.weekButtonText}
          onPress={goToNextWeek}
          disabled={disableNextWeek}
        />
      </View>

      {measureType === 'points' ? (
        <View style={styles.winnersContainer}>
          {leaderboardData.map((winner, _index) => {
            return <PointWeekCard key={winner.id} data={winner} />;
          })}
        </View>
      ) : (
        <WeightWeekCard data={leaderboardData[0]} />
      )}

      {measureType === 'points' && (
        <View style={styles.awardsContainer}>
          {AWARDS.map(award => (
            <View key={award.name} style={styles.awardItem}>
              <Icon name={award.icon} size={20} color={award.color} />
              <Text style={styles.awardText}>{award.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const ChallengeSection = ({
  measureType,
  currentWeek,
  challengeDuration,
  leaderboardData,
}: {
  measureType: MeasureType;
  currentWeek: number;
  challengeDuration: number;
  leaderboardData: LeaderboardEntry[];
}) => {
  const weeksRemaining = useMemo(() => {
    return Math.max(0, challengeDuration - currentWeek);
  }, [challengeDuration, currentWeek]);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {measureType === 'points' ? 'Challenge Leaderboard' : 'Overall % Loss'}
      </Text>

      {measureType === 'points' ? (
        leaderboardData.length > 0 ? (
          <FlatList
            data={leaderboardData}
            scrollEnabled={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.leaderboardItem}>
                <ProfileIcon
                  image={item.user.image}
                  initialsText={getUserInitials(item.user)}
                  size={40}
                />
                <Text style={styles.leaderboardName}>
                  {getUserName(item.user)}
                </Text>
                <Icon
                  name="chevron-right"
                  size={20}
                  color={COLORS.gray.mediumDark}
                />
                <Text style={styles.leaderboardPoints}>{item.points} pts</Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No leaderboard data available</Text>
        )
      ) : leaderboardData.length > 0 ? (
        <FlatList
          data={leaderboardData}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.weightLossItem}>
              <ProfileIcon
                image={item.user.image}
                initialsText={getUserInitials(item.user)}
                size={40}
              />
              <Text style={styles.weightLossName}>
                {getUserName(item.user)}
              </Text>
              <Icon name="bar-chart" size={16} color={COLORS.primary.green} />
              <Text style={styles.weightLossPercent}>-2.1%</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No weight loss data available</Text>
      )}

      {weeksRemaining > 0 && (
        <View style={styles.weeksRemainingContainer}>
          <Text style={styles.weeksRemainingText}>
            We have {weeksRemaining} {weeksRemaining === 1 ? 'week' : 'weeks'}{' '}
            left!
          </Text>
        </View>
      )}
    </View>
  );
};

export const LeaderboardScreen: React.FC = () => {
  const { selectedChallenge } = useChallengesStore();
  const isFocused = useIsFocused();
  const {
    weekLeaderboardData,
    challengeLeaderboardData,
    loading,
    fetchLeaderboard,
  } = useLeaderboard(selectedChallenge?.id as string);

  const [measureType, setMeasureType] = useState<MeasureType>('points');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  useEffect(() => {
    if (!isFocused) return;
    fetchLeaderboard(selectedWeek, measureType);
  }, [selectedWeek, measureType, fetchLeaderboard, isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <CustomButton
          text="Points"
          onPress={() => setMeasureType('points')}
          buttonStyle={[
            styles.toggleButton,
            measureType === 'points' && styles.toggleButtonActive,
          ]}
          textStyle={[
            styles.toggleText,
            measureType === 'points' && styles.toggleTextActive,
          ]}
        />
        <CustomButton
          text="Weight Loss"
          onPress={() => setMeasureType('weight')}
          buttonStyle={[
            styles.toggleButton,
            measureType === 'weight' && styles.toggleButtonActive,
          ]}
          textStyle={[
            styles.toggleText,
            measureType === 'weight' && styles.toggleTextActive,
          ]}
        />
      </View>

      {loading ? (
        <LoadingCard
          message="Loading leaderboard data..."
          subMessage="Please wait while we fetch the latest leaderboard data."
          visible={loading}
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {weekLeaderboardData && (
            <WeekSection
              measureType={measureType}
              leaderboardData={weekLeaderboardData || []}
              currentWeek={selectedChallenge?.current_week || 1}
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
            />
          )}
          {challengeLeaderboardData && (
            <ChallengeSection
              measureType={measureType}
              currentWeek={selectedChallenge?.current_week || 1}
              challengeDuration={selectedChallenge?.duration || 2}
              leaderboardData={challengeLeaderboardData || []}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.white,
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.primary.green,
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary.green,
  },
  toggleText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.green,
  },
  toggleTextActive: {
    color: COLORS.primary.white,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.black,
    marginBottom: 12,
  },
  winnersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  awardsContainer: {
    gap: 12,
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  awardText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.black,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray.veryLight,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  leaderboardName: {
    flex: 1,
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.black,
  },
  leaderboardPoints: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.primary.black,
  },
  weightLossItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary.white,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  weightLossName: {
    flex: 1,
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.black,
  },
  weightLossPercent: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.black,
  },
  weeksRemainingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  weeksRemainingText: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.red,
  },
  emptyText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.gray.mediumDark,
    textAlign: 'center',
    paddingVertical: 24,
  },
  weekContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  weekText: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.black,
  },
  weekButton: {
    backgroundColor: 'transparent',
  },
  weekButtonText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
  },
});
