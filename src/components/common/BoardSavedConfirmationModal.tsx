import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { CustomButton } from '../common/Button';

interface BoardSavedConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  weekNumber: number;
  startDate: Date | null;
  status?: string | null;
}

export const BoardSavedConfirmationModal: React.FC<
  BoardSavedConfirmationModalProps
> = ({ visible, onClose, weekNumber, startDate, status }) => {
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

  if (!visible) return null;

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.overlay}>
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
          {status === 'ready' ? (
            <>
              <Text style={styles.title}>
                ✅ Your Week {weekNumber} Bingo Card is ready
              </Text>
              {startDate && (
                <Text style={styles.subtitle}>
                  📅 Your challenge will start on {formatDate(startDate)}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.title}>
                ✅ Your Week {weekNumber} tasks have been saved
              </Text>
              <Text style={styles.subtitle}>
                Continue adding tasks until your board is complete. Once all
                tasks are selected, your board will be ready for players.
              </Text>
            </>
          )}

          <CustomButton
            text="Got it"
            onPress={onClose}
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
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
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: FONTS.family.poppinsRegular,
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary.green,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
  },
  buttonText: {
    color: COLORS.primary.white,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
    textAlign: 'center',
  },
});
