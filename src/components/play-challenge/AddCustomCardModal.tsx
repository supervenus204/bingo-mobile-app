import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS, FONTS } from '../../theme';
import { BingoCard, CustomButton, Modal } from '../common';

const AVAILABLE_COLORS = Object.values(COLORS.bingo);
const AVAILABLE_FONT_COLORS = [COLORS.primary.white, COLORS.primary.black];

interface AddCustomCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    color: string,
    font_color: string,
    font_name: string,
    count: number
  ) => void;
}

export const AddCustomCardModal: React.FC<AddCustomCardModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [selectedFontColor, setSelectedFontColor] = useState(
    AVAILABLE_FONT_COLORS[0]
  );
  const [count, setCount] = useState(1);

  const handleSave = () => {
    if (title.trim()) {
      onSave(
        title.trim(),
        selectedColor,
        selectedFontColor,
        FONTS.family.bingo, // Default font
        count
      );
      setTitle('');
      setSelectedColor(AVAILABLE_COLORS[0]);
      setSelectedFontColor(AVAILABLE_FONT_COLORS[0]);
      setCount(1);
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setSelectedColor(AVAILABLE_COLORS[0]);
    setSelectedFontColor(AVAILABLE_FONT_COLORS[0]);
    setCount(1);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleCancel}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Custom Card</Text>

        <View style={styles.previewContainer}>
          <BingoCard
            color={selectedColor}
            font_color={selectedFontColor}
            font_name={FONTS.family.bingo}
            name={title.trim()}
            count={count}
            mode="setup"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Card Name</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter card name"
            placeholderTextColor={COLORS.gray.mediumDark}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>BackgroundColor</Text>
          <View style={styles.colorGrid}>
            {AVAILABLE_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === COLORS.bingo.white && styles.blackBorder,
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Font Color</Text>
          <View style={styles.colorGrid}>
            {AVAILABLE_FONT_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedFontColor === COLORS.primary.white &&
                    styles.blackBorder,
                  selectedFontColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedFontColor(color)}
              >
                {selectedFontColor === color && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Count</Text>
          <View style={styles.countContainer}>
            <TouchableOpacity
              style={styles.countButton}
              onPress={() => setCount(Math.max(1, count - 1))}
            >
              <Text style={styles.countButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.countInput}
              value={count.toString()}
              onChangeText={text => {
                const num = parseInt(text) || 1;
                setCount(Math.max(1, num));
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.countButton}
              onPress={() => setCount(count + 1)}
            >
              <Text style={styles.countButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            text="Cancel"
            onPress={handleCancel}
            variant="outline"
            buttonStyle={styles.cancelButton}
          />
          <CustomButton
            text="Add Card"
            onPress={handleSave}
            variant="primary"
            buttonStyle={styles.saveButton}
            disabled={!title.trim()}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.blue,
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.blue,
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.blue,
    backgroundColor: COLORS.primary.white,
  },
  previewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderColor: COLORS.primary.blue,
    borderWidth: 3,
  },
  blackBorder: {
    borderColor: COLORS.gray.mediumDark,
    borderWidth: 1,
  },
  checkmark: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.primary.white,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: COLORS.primary.black,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonText: {
    fontSize: 20,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.primary.blue,
  },
  countInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.primary.blue,
    textAlign: 'center',
    backgroundColor: COLORS.primary.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 40,
  },
  saveButton: {
    flex: 1,
    height: 40,
  },
});
