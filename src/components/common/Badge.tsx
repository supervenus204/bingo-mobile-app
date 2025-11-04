import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, FONTS } from '../../theme';

type BadgeProps = {
  count: number;
  style?: ViewStyle;
  maxCount?: number; // Maximum number to display (e.g., 99+)
};

export const Badge: React.FC<BadgeProps> = ({
  count,
  style,
  maxCount = 99,
}) => {
  // Don't render if count is 0 or less
  if (count <= 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.red.bright || '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  text: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.family.poppinsSemiBold,
    fontWeight: '600',
    textAlign: 'center',
  },
});

