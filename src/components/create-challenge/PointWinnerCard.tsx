import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, FONTS } from '../../theme';
import { ProfileIcon } from '../common';

interface LeaderboardUser {
  id: string;
  firstName: string;
  lastName: string;
  image?: string | null;
  points: number;
  position: number;
  completionDate?: string | null;
  awards?: string[];
}

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

export const PointWinnerCard: React.FC<{
  user: LeaderboardUser;
  position: number;
}> = ({ user, position }) => {
  const getBadgeColor = () => {
    switch (position) {
      case 1:
        return COLORS.blue.oxford;
      case 2:
        return COLORS.gray.medium;
      case 3:
        return COLORS.secondary.orange.web;
      default:
        return COLORS.gray.medium;
    }
  };

  const getStatusIcon = () => {
    if (user.completionDate) {
      return <Icon name="check-circle" size={16} color={COLORS.green.forest} />;
    }
    return <Icon name="camera-alt" size={16} color={COLORS.gray.mediumDark} />;
  };

  return (
    <View style={styles.container}>
      {position === 1 && (
        <View
          style={[styles.positionBadge, { backgroundColor: getBadgeColor() }]}
        >
          <Text style={styles.positionBadgeText}>1{getOrdinalSuffix(1)}</Text>
          <Icon name="star" size={10} color={COLORS.white} />
        </View>
      )}
      <ProfileIcon
        image={user.image}
        initialsText={(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
        size={60}
      />
      <Text style={styles.winnerName}>{user.firstName}</Text>
      <Text style={styles.winnerPoints}>{user.points} pts</Text>
      <View style={styles.winnerStatusIcon}>{getStatusIcon()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
    width: 100,
  },

  positionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    zIndex: 1,
  },
  positionBadgeText: {
    fontSize: FONTS.size.xs,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.white,
  },

  winnerName: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.white,
    marginTop: 8,
  },
  winnerPoints: {
    fontSize: FONTS.size.xs,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.white,
    marginTop: 4,
  },
  winnerStatusIcon: {
    marginTop: 4,
  },
});
