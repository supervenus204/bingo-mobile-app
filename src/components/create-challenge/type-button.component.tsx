import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../../theme';

interface TypeButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const TypeButton: React.FC<TypeButtonProps> = ({
  label,
  isSelected,
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.typeButton,
        isSelected && styles.typeButtonSelected,
        disabled && styles.typeButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.typeButtonText,
          isSelected && styles.typeButtonTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  typeButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.blue.indigo,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  typeButtonSelected: {
    backgroundColor: COLORS.blue.indigo,
  },
  typeButtonDisabled: {
    backgroundColor: COLORS.gray.light,
  },
  typeButtonText: {
    fontFamily: FONTS.family.poppinsMedium,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: COLORS.white,
  },
});
