import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';

type Variant = 'primary' | 'outline' | 'neutral';

type LabelProps = {
  text: string;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  labelStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Label: React.FC<LabelProps> = ({
  text,
  variant = 'primary',
  onPress,
  disabled = false,
  labelStyle,
  textStyle,
}) => {
  const content = (
    <View
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        labelStyle,
      ]}
    >
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
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  base: {
    padding: 4,
    borderRadius: 36,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.gray.veryLight,
  },
  primary: {
    backgroundColor: COLORS.green.forest,
  },
  outline: {
    backgroundColor: '#F0F8F0',
    borderWidth: 1,
    borderColor: '#2D5A2D',
  },
  text: {
    fontSize: 12,
    fontFamily: FONTS.family.poppinsRegular,
  },
  textOnPrimary: {
    color: COLORS.white,
  },
  textOnOutline: {
    color: '#2D5A2D',
  },
});
