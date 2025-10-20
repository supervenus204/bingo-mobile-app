import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { Label } from '../ui/Label';

type Props = {
  title: string;
  currentWeek: number;
  totalWeeks: number;
  progress: number; // 0..1
  status: 'active' | 'pending' | 'in_active' | 'finished' | 'unpaid';
  categoryName?: string;
  containerStyle?: ViewStyle;
  isOrganizer?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onPayPress?: () => void;
};

export const ChallengeCard: React.FC<Props> = ({
  title,
  currentWeek,
  totalWeeks,
  progress,
  categoryName,
  containerStyle,
  isOrganizer,
  onPress,
  onPayPress,
  status,
  disabled,
}) => {
  const percent = Math.max(0, Math.min(progress, 1));

  const getStatusBadge = () => {
    if (status === 'active') {
      return <View style={[styles.statusBadge, styles.activeBadge]} />;
    } else if (status === 'pending') {
      return <View style={[styles.statusBadge, styles.pendingBadge]} />;
    } else if (status === 'unpaid') {
      return <View style={[styles.statusBadge, styles.unpaidBadge]} />;
    }
    return null;
  };

  const getStatusText = () => {
    if (status === 'pending') {
      return 'Start from next Mon';
    }
    return null;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        isOrganizer ? styles.organizerCard : styles.participantCard,
        containerStyle,
        disabled && { opacity: 0.5 },
      ]}
      disabled={disabled}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          {getStatusBadge()}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Label
          text={status.toUpperCase()}
          labelStyle={styles.statusPill}
          textStyle={styles.statusText}
        />
      </View>

      <View style={styles.subRow}>
        {categoryName ? (
          <Text style={[styles.planText, { fontFamily: FONTS.family.poppinsMedium }]}>{categoryName}</Text>
        ) : null}
      </View>

      <View style={styles.subRow}>
        <Text
          style={styles.planText}
        >{`Week ${currentWeek} of ${totalWeeks}`}</Text>
        {getStatusText() && (
          <Text style={styles.statusText}>{getStatusText()}</Text>
        )}
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent * 100}%` }]} />
      </View>

      {status === 'unpaid' && onPayPress && (
        <TouchableOpacity
          style={styles.payButton}
          onPress={onPayPress}
          activeOpacity={0.7}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    padding: 14,
    marginVertical: 8,
    shadowColor: COLORS.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  organizerCard: {
    backgroundColor: COLORS.white,
  },
  participantCard: {
    backgroundColor: COLORS.gray.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: COLORS.green.forest, // Deep blue
  },
  pendingBadge: {
    backgroundColor: '#FF8C00', // Vibrant orange
  },
  unpaidBadge: {
    backgroundColor: '#FF4444', // Red for unpaid
  },
  statusPill: {},
  statusText: { fontSize: 12 },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  planText: {
    fontFamily: FONTS.family.poppinsRegular,
    color: '#666666',
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green.forest,
  },
  payButton: {
    backgroundColor: COLORS.green.forest,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
  },
});
