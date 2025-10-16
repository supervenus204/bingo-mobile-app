import { useNavigation } from '@react-navigation/native';
import { Image } from '@rneui/base';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui';
import { SCREEN_NAMES } from '../constants/screens';
import { useOnboardingStore } from '../store';
import { FONTS } from '../theme';
import { COLORS } from '../theme/_colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const hasCompletedOnboarding = useOnboardingStore(s => s.hasCompletedOnboarding);

  const handleNext = () => {
    if (hasCompletedOnboarding) {
      navigation.navigate(SCREEN_NAMES.AUTH as never);
    } else {
      navigation.navigate(SCREEN_NAMES.ONBOARDING as never);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/welcome/logo.png')}
          style={styles.logo} 
        />
      </View>

      <View style={[styles.transitionIcon]}>
        <Image
          source={require('../assets/images/welcome/mark-1.png')}
          style={styles.smallIcon}
        />
      </View>

      <View style={[styles.textContainer]}>
        <Text style={[styles.description, { color: COLORS.welcome?.tertiary }]}>
          Join fun health challenges with friends and family.
        </Text>

        <Button
          text="GET STARTED"
          textStyle={styles.textStyle}
          buttonStyle={styles.buttonStyle}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 0.75 * DEVICE_WIDTH,
    height: 'auto',
    resizeMode: 'contain',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 52,
    backgroundColor: COLORS.green.light_2,
  },
  description: {
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: FONTS.family.poppinsSemiBold,
    paddingHorizontal: 20,
  },
  buttonStyle: {
    borderRadius: 12,
    width: DEVICE_WIDTH * 0.8,
    height: 50,
    backgroundColor: COLORS.pink.bright_1,
  },
  textStyle: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.white,
  },
  transitionIcon: {
    position: 'absolute',
    top: DEVICE_HEIGHT * 0.4 - 25,
    borderRadius: 12,
    zIndex: 1,
    alignSelf: 'center',
  },
  smallIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
