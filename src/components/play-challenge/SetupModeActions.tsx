import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../theme';
import { CustomButton } from '../common';

interface SetupModeActionsProps {
  onAddCustom: () => void;
  onReset: () => void;
  onSave: () => void;
  saving: boolean;
}

export const SetupModeActions: React.FC<SetupModeActionsProps> = ({
  onAddCustom,
  onReset,
  onSave,
  saving,
}) => {
  return (
    <>
      <CustomButton
        variant="default"
        buttonStyle={styles.addCustomButton}
        textStyle={styles.addCustomButtonText}
        onPress={onAddCustom}
        icon={
          <MaterialIcons name="add" size={24} color={COLORS.primary.white} />
        }
        text="Add Custom Task"
      />
      <View style={styles.buttonGroup}>
        <CustomButton
          text="Reset Tasks"
          onPress={onReset}
          variant="primary"
          buttonStyle={styles.resetButton}
        />
        <CustomButton
          text="Save Tasks"
          onPress={onSave}
          variant="primary"
          buttonStyle={styles.saveButton}
          loading={saving}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 4,
  },
  resetButton: {
    flex: 1,
    minHeight: 48,
    paddingVertical: 4,
    backgroundColor: COLORS.primary.pink,
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.blue,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 16,
    marginHorizontal: 16,
    gap: 8,
  },
  addCustomButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.primary.white,
  },
});
