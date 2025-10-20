import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
      {disabled && (
        <View style={styles.lockIconContainer}>
          <Icon name="lock" size={24} color={COLORS.gray.medium} />
        </View>
      )}
      <Text
        style={[
          styles.typeButtonText,
          isSelected && styles.typeButtonTextSelected,
          disabled && styles.typeButtonTextDisabled,
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
    height: 80,
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
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.blue.indigo,
    lineHeight: 18,
  },
  typeButtonTextSelected: {
    color: COLORS.white,
  },
  typeButtonTextDisabled: {
    color: COLORS.gray.medium,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.6,
  },
});
