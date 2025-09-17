import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';

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
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color={COLORS.primary.main} />
          {!!message && <Text style={styles.message}>{message}</Text>}
          {!!subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 260,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
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
    color: COLORS.blue.oxford,
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
