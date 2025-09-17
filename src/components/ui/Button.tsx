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

type ButtonProps = {
  onPress: () => void;
  text: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
};

export const Button: React.FC<ButtonProps> = ({
  onPress,
  text,
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
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.textOnPrimary,
            variant === 'outline' && styles.textOnOutline,
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  textOnPrimary: {
    color: COLORS.white,
  },
  textOnOutline: {
    color: COLORS.green.forest,
  },
});
