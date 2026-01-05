import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { formatCountdown, getTimeRemaining } from '../../utils/date.utils';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  variant?: 'default' | 'compact' | 'large';
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  label,
  variant = 'default',
  onComplete,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(targetDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeRemaining(remaining);

      if (remaining.totalMs <= 0 && onComplete) {
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const formattedTime = formatCountdown(
    timeRemaining.days,
    timeRemaining.hours,
    timeRemaining.minutes,
    timeRemaining.seconds
  );

  const isExpired = timeRemaining.totalMs <= 0;

  if (isExpired) {
    return null;
  }

  const containerStyle =
    variant === 'large'
      ? styles.largeContainer
      : variant === 'compact'
        ? styles.compactContainer
        : styles.defaultContainer;

  const timeStyle =
    variant === 'large'
      ? styles.largeTime
      : variant === 'compact'
        ? styles.compactTime
        : styles.defaultTime;

  const labelStyle =
    variant === 'compact'
      ? styles.compactLabel
      : variant === 'large'
        ? styles.largeLabel
        : styles.label;

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <Text style={timeStyle}>{formattedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    alignItems: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  largeContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary.green + '15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary.green + '30',
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  compactLabel: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
    marginRight: 4,
  },
  largeLabel: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  defaultTime: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.green,
  },
  compactTime: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.green,
  },
  largeTime: {
    fontSize: 24,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.green,
    letterSpacing: 1,
  },
});

