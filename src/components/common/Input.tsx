import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../theme';

type InputProps = {
  inputStyle?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  secureTextEntry?: boolean;
  isValid?: boolean;
  showValidation?: boolean;
};

export const Input: React.FC<InputProps> = ({
  inputStyle,
  placeholder,
  value,
  onChangeText,
  disabled,
  label,
  labelStyle,
  secureTextEntry,
  isValid,
  showValidation,
}) => {
  const renderValidationIcon = () => {
    if (!showValidation || isValid === undefined) return null;

    return (
      <View style={styles.validationIcon}>
        <Text style={[styles.iconText, { color: isValid ? COLORS.green.pigment : COLORS.red.bright }]}>
          {isValid ? '✓' : '✗'}
        </Text>
      </View>
    );
  };

  return (
    <>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            inputStyle,
            showValidation && isValid !== undefined && {
              borderColor: isValid ? COLORS.green.pigment : COLORS.red.bright,
            }
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray.mediumDark}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
        />
        {renderValidationIcon()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
  validationIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
