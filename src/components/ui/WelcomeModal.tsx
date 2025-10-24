import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../theme';
import { Button } from '../common/Button';
import { Modal } from './Modal';

interface WelcomeModalProps {
  visible: boolean;
  onClose: () => void;
  onLetsGo: () => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  visible,
  onClose,
  onLetsGo,
  title = 'Welcome aboard!',
  subtitle = "Week 1 starts now—let's get moving.",
  buttonText = "LET'S GO",
}) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Button
          text={buttonText}
          onPress={onLetsGo}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 24,
    color: COLORS.blue.oxford,
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
    backgroundColor: COLORS.green.forest,
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.family.poppinsBold,
    fontSize: 16,
    textAlign: 'center',
  },
});
