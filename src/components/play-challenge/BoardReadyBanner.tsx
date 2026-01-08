import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface BoardReadyBannerProps {
  weekNumber: number;
  startDate: Date | null;
}

export const BoardReadyBanner: React.FC<BoardReadyBannerProps> = ({
  weekNumber,
  startDate,
}) => {
  if (!startDate) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Your Bingo board is ready</Text>
      <Text style={styles.subtitle}>
        Week {weekNumber} will be live for players on{' '}
        {startDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: COLORS.primary.green + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary.green + '30',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.primary.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.primary.white,
    textAlign: 'center',
    opacity: 0.9,
  },
});
