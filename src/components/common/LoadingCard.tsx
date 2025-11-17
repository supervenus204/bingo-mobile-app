import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS, FONTS } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  message?: string;
  subMessage?: string;
};

export const LoadingCard: React.FC<Props> = ({
  visible,
  message,
  subMessage,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.primary.green} />
          {!!message && <Text style={styles.message}>{message}</Text>}
          {!!subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 260,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary.white,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  message: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.primary.blue,
    fontFamily: FONTS.family.poppinsMedium,
  },
  subMessage: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.gray.darker,
    fontFamily: FONTS.family.poppinsRegular,
  },
});
