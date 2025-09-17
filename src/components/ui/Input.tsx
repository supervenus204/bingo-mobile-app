import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
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
}) => {
  return (
    <>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray.mediumDark}
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
      />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
});
