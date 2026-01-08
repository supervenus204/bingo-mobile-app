import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { CustomButton } from '../common/Button';

interface BingoCardFullModalProps {
  visible: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const BingoCardFullModal: React.FC<BingoCardFullModalProps> = ({
  visible,
  onSave,
  onCancel,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const screenWidth = Dimensions.get('window').width;
  const modalWidth = (screenWidth * 85) / 100;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <RNModal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.modalContainer,
                { width: modalWidth },
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.content}>
                <Text style={styles.title}>Your Bingo Card is full.</Text>

                <View style={styles.buttonContainer}>
                  <CustomButton
                    text="Save Bingo Card"
                    onPress={onSave}
                    buttonStyle={styles.saveButton}
                    textStyle={styles.saveButtonText}
                  />
                  <CustomButton
                    text="Cancel"
                    onPress={onCancel}
                    variant="outline"
                    buttonStyle={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: '95%',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 24,
    color: COLORS.primary.blue,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  saveButton: {
    height: 48,
    width: '100%',
    backgroundColor: COLORS.primary.green,
  },
  saveButtonText: {
    color: COLORS.primary.white,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    height: 48,
    width: '100%',
  },
  cancelButtonText: {
    color: COLORS.primary.green,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
    textAlign: 'center',
  },
});

