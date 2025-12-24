import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS, FONTS } from '../../theme';

interface ChallengeFieldProps {
  label: string;
  value: string | number;
}

export const ChallengeField: React.FC<ChallengeFieldProps> = ({
  label,
  value,
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
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
  fieldValue: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.text.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray.light,
    borderRadius: 8,
  },
});

