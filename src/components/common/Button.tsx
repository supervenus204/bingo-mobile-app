import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';

type CustomButtonProps = {
  text?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'default';
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  text,
  icon,
  buttonStyle,
  textStyle,
  loading,
  disabled,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'default' && styles.default,
        (disabled || loading) && styles.buttonDisabled,
        buttonStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? COLORS.white : COLORS.green.forest}
        />
      ) : (
        <>
          {icon}
          {text && (
            <Text
              style={[
                styles.text,
                variant === 'primary' && styles.textOnPrimary,
                variant === 'outline' && styles.textOnOutline,
                variant === 'default' && styles.textOnDefault,
                textStyle,
              ]}
            >
              {text}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 100,
  },
  text: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primary: {
    backgroundColor: COLORS.green.forest,
  },
  outline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.green.forest,
  },
  default: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  textOnPrimary: {
    color: COLORS.white,
  },
  textOnOutline: {
    color: COLORS.green.forest,
  },
  textOnDefault: {
    color: COLORS.green.forest,
  },
});
