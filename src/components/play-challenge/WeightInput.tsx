import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface WeightInputProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  decimalPlaces?: number;
}

export const WeightInput: React.FC<WeightInputProps> = ({
  value,
  onValueChange,
  minValue = 30,
  maxValue = 200,
  step = 1,
  decimalPlaces = 1,
}) => {
  const [inputValue, setInputValue] = useState(value.toFixed(decimalPlaces));

  const formatValue = (num: number): string => {
    return num.toFixed(decimalPlaces);
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, maxValue);
    onValueChange(newValue);
    setInputValue(formatValue(newValue));
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, minValue);
    onValueChange(newValue);
    setInputValue(formatValue(newValue));
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const numValue: number = parseFloat(text);
    if (!isNaN(numValue) && numValue >= minValue && numValue <= maxValue) {
      onValueChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < minValue || numValue > maxValue) {
      setInputValue(formatValue(value));
    } else {
      setInputValue(formatValue(numValue));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={handleInputChange}
          onBlur={handleInputBlur}
          keyboardType="numeric"
          placeholder="0.0"
          placeholderTextColor="#9ca3af"
        />

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleIncrement}
            activeOpacity={0.7}>
            <Icon name="keyboard-arrow-up" size={16} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.arrowButton}
            onPress={handleDecrement}
            activeOpacity={0.7}>
            <Icon name="keyboard-arrow-down" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.unit}>kg</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    minWidth: 40,
  },
  controlsContainer: {
    marginHorizontal: 8,
  },
  arrowButton: {
    padding: 2,
    marginVertical: 1,
  },
  unit: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
});
