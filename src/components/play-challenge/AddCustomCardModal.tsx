import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme';
import { FONTS } from '../../theme/fonts';
import { CustomButton } from '../common/Button';
import { Modal } from '../common/Modal';

interface AddCustomCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, color: string, count: number) => void;
}

const AVAILABLE_COLORS = [
  COLORS.secondary.blue.maya,
  COLORS.secondary.blue.argentinian,
  COLORS.secondary.yellow.jasmine,
  COLORS.secondary.blue.alice,
  COLORS.green.light,
  COLORS.secondary.orange.web,
  COLORS.secondary.purple.mauve_2,
  COLORS.green.sgbus,
  COLORS.secondary.orange.xanthous_1,
  COLORS.primary.pink.bright_2,
  COLORS.primary.green.mantis,
  COLORS.green.light_3,
  COLORS.secondary.orange.xanthous_2,
  COLORS.primary.pink.cherry,
  COLORS.secondary.blue.columbia,
  COLORS.secondary.purple.periwinkle,
  COLORS.green.nyanza,
  COLORS.secondary.purple.mauve_1,
  COLORS.green.nyanza_2,
  COLORS.secondary.blue.uranian,
  COLORS.secondary.yellow.mustard,
  COLORS.green.light_2,
  COLORS.primary.pink.lavender,
  COLORS.primary.pink.bright_1,
];

export const AddCustomCardModal: React.FC<AddCustomCardModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [count, setCount] = useState(1);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), selectedColor, count);
      setTitle('');
      setSelectedColor(AVAILABLE_COLORS[0]);
      setCount(1);
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setSelectedColor(AVAILABLE_COLORS[0]);
    setCount(1);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleCancel}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Custom Card</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            placeholderTextColor={COLORS.gray.mediumDark}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorGrid}>
            {AVAILABLE_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
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
              onChangeText={(text) => {
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
    color: COLORS.blue.oxford,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.blue.oxford,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.blue.oxford,
    backgroundColor: COLORS.white,
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
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderColor: COLORS.blue.oxford,
    borderWidth: 3,
  },
  checkmark: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: COLORS.black,
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
    color: COLORS.blue.oxford,
  },
  countInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray.lightMedium,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.blue.oxford,
    textAlign: 'center',
    backgroundColor: COLORS.white,
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

