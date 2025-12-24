import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, FONTS } from '../../theme';

interface DurationSelectorProps {
  duration: number;
  maxWeeks: number;
  onChange: (increment: boolean) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  maxWeeks,
  onChange,
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Duration</Text>
      <View style={styles.durationContainer}>
        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => onChange(false)}
        >
          <Text
            style={[
              styles.durationButtonText,
              {
                color:
                  duration === 1 ? COLORS.gray.medium : COLORS.text.primary,
              },
            ]}
          >
            -
          </Text>
        </TouchableOpacity>

        <View style={styles.durationDisplay}>
          <Text style={styles.durationValue}>{duration}</Text>
          <Text style={styles.durationUnit}>weeks</Text>
        </View>

        <TouchableOpacity
          style={styles.durationButton}
          onPress={() => onChange(true)}
        >
          <Text
            style={[
              styles.durationButtonText,
              {
                color:
                  duration === maxWeeks
                    ? COLORS.gray.medium
                    : COLORS.text.primary,
              },
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.text.secondary,
    marginBottom: 8,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  durationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationButtonText: {
    fontSize: 20,
    fontFamily: FONTS.family.poppinsBold,
  },
  durationDisplay: {
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 24,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.text.primary,
  },
  durationUnit: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.secondary,
  },
});

