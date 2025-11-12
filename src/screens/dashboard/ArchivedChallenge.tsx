import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CustomButton, LoadingCard } from '../../components/common';
import { DashboardHeader } from '../../components/dashboard';
import { SCREEN_NAMES } from '../../constants';
import { useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { DashboardStackParamList } from '../../types/navigation.type';

type NavigationProp = NativeStackNavigationProp<DashboardStackParamList>;

export const ArchivedChallenge: React.FC = () => {
  const { archivedChallenges, loading, fetchChallenges } = useChallengesStore();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchChallenges();
  }, []);

  const goToOngoingChallenges = () => {
    navigation.navigate(SCREEN_NAMES._DASHBOARD.CHALLENGES_LIST);
  };

  const renderChallengeCard = (challenge: any, index: number) => {
    const progress =
      (challenge.current_week ?? 0) / Math.max(1, challenge.duration);
    const showUpgradeButton = index === 1; // Show upgrade button on second card

    return (
      <View key={challenge.id} style={styles.challengeCard}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.duration}>{challenge.duration} Weeks</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {challenge.is_organizer ? 'Hosted' : 'Joined'}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>

        {showUpgradeButton && (
          <CustomButton
            buttonStyle={styles.upgradeButton}
            textStyle={styles.upgradeButtonText}
            text="UPGRADE PLAN"
            variant="default"
            onPress={() => {}}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <DashboardHeader
        title="Archive Challenges"
        action={
          <CustomButton
            text="View Ongoing"
            variant="default"
            onPress={goToOngoingChallenges}
          />
        }
      />

      <View style={styles.content}>
        {loading ? (
          <LoadingCard
            visible={loading}
            message="Loading archived challenges..."
            subMessage="Please wait a moment"
          />
        ) : archivedChallenges.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Archived Challenges</Text>
            <Text style={styles.emptySubtitle}>
              Your completed challenges will appear here
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {archivedChallenges.map((challenge, index) =>
              renderChallengeCard(challenge, index)
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  viewActiveText: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.green.forest,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: FONTS.size['2xl'],
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.oxford,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONTS.size.lg,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.gray.dark,
    textAlign: 'center',
  },
  challengeCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsBold,
    color: '#333333',
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: '#666666',
  },
  statusBadge: {
    backgroundColor: '#7ED957',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.white,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7ED957',
    borderRadius: 4,
  },
  lockIcon: {
    fontSize: 16,
    color: '#FF69B4',
  },
  upgradeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.family.poppinsBold,
    textTransform: 'uppercase',
  },
});
