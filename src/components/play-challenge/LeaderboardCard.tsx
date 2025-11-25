import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { AWARDS } from '../../constants';
import { COLORS, FONTS } from '../../theme';
import { LeaderboardEntry, User } from '../../types';
import { ProfileIcon } from '../common';

const getUserInitials = (user: User): string => {
  const first = user.firstName?.[0] ?? '';
  const last = user.lastName?.[0] ?? '';
  return (first + last).toUpperCase() || 'U';
};

const getUserName = (user: User): string => {
  if (user.displayName) return user.displayName;
  if (user.firstName && user.lastName)
    return `${user.firstName} ${user.lastName}`;
  return 'User';
};

interface PointWeekCardProps {
  data: LeaderboardEntry;
  rank?: number;
}

export const PointWeekCard: React.FC<PointWeekCardProps> = ({ data, rank }) => {
  const isFirstPlace = rank === 1;

  return (
    <View style={styles.card}>
      <ProfileIcon
        image={data.user.image}
        initialsText={getUserInitials(data.user)}
        size={48}
      />

      <View style={styles.content}>
        <Text style={styles.text} numberOfLines={1}>
          {getUserName(data.user)}
        </Text>
        <Text style={styles.text}>{data.points} pts</Text>
      </View>

      {data.awards && data.awards.length > 0 && (
        <View style={styles.awards}>
          {data.awards.map(awardName => {
            const awardObj = AWARDS.find(a => a.name === awardName);
            return awardObj ? (
              <Icon
                key={awardName}
                name={awardObj.icon}
                size={18}
                color={awardObj.color}
                style={styles.awardIcon}
              />
            ) : null;
          })}
        </View>
      )}

      {isFirstPlace && (
        <View style={styles.medalContainer}>
          <View style={styles.medalTop}>
            <Icon name="emoji-events" size={16} color="#FFF" />
          </View>
        </View>
      )}
    </View>
  );
};

export const PointChallengeCard = () => {
  return (
    <View>
      <Text>Point Challenge Card</Text>
    </View>
  );
};

interface WeightWeekCardProps {
  data: LeaderboardEntry;
}

export const WeightWeekCard: React.FC<WeightWeekCardProps> = ({ data }) => {
  if (!data || !data.user) {
    return null;
  }

  const lossPercentage =
    data.loss !== undefined && data.loss !== null
      ? Math.abs(data.loss).toFixed(1)
      : '0.0';

  return (
    <View style={styles.biggestLoserCard}>
      <ProfileIcon
        image={data.user.image}
        initialsText={getUserInitials(data.user)}
        size={80}
      />
      <Text style={styles.biggestLoserName}>{getUserName(data.user)}</Text>
      <View style={styles.weightLossBadge}>
        <Text style={styles.weightLossText}>-{lossPercentage}%</Text>
      </View>
    </View>
  );
};

export const WeightChallengeCard = () => {
  return (
    <View>
      <Text>Weight Challenge Card</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    width: '30%',
    margin: 4,
    borderWidth: 1,
    borderColor: COLORS.gray.medium,
  },
  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    alignItems: 'center',
    width: 40,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    fontSize: 14,
    fontWeight: FONTS.weight.bold,
    color: COLORS.primary.black,
  },
  awards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  awardIcon: {
    marginLeft: 4,
  },
  medalTop: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary.gold,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  biggestLoserCard: {
    alignItems: 'center',
    backgroundColor: COLORS.gray.dark,
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
  },
  biggestLoserName: {
    fontSize: FONTS.size.base,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.primary.white,
    marginTop: 12,
  },
  weightLossBadge: {
    backgroundColor: COLORS.primary.green,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  weightLossText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.white,
  },
});
