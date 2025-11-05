import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import {
  Dimensions,
  Image as RNImage,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CustomButton } from '../components/common';
import { SCREEN_NAMES } from '../constants/screens';
import { useWelcomeScreenStore } from '../store';
import { COLORS, FONTS } from '../theme';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const WelcomeScreens = [
  {
    image: require('../assets/images/welcome/logo.png'),
    mark: require('../assets/images/welcome/mark-1.png'),
    title: 'Join fun health challenges with friends and family.',
    titleColor: COLORS.primary.welcome.tertiary,
    bgColor: COLORS.green.light_2,
    buttonColor: COLORS.primary.pink.bright_1,
  },
  {
    image: require('../assets/images/welcome/image-1.png'),
    mark: require('../assets/images/welcome/mark-1.png'),
    title: 'Turn Habits Into Fun!',
    titleColor: COLORS.white,
    description:
      'Join challenges with friends & family, check off tasks, earn points, and celebrate every healthy win together',
    bgColor: COLORS.primary.welcome.tertiary,
    buttonColor: COLORS.primary.welcome.secondary,
  },
  {
    image: require('../assets/images/welcome/image-2.png'),
    mark: require('../assets/images/welcome/mark-2.png'),
    title: 'Track Your Weekly Wins!',
    titleColor: COLORS.white,
    description:
      'Mark off tasks, log your weight-ins, and watch your progress climb up the leaderboard each week!',
    bgColor: COLORS.primary.welcome.quaternary,
    buttonColor: COLORS.primary.welcome.tertiary,
  },
  {
    image: require('../assets/images/welcome/image-3.png'),
    mark: require('../assets/images/welcome/mark-3.png'),
    title: 'Stay Motivated Together',
    titleColor: COLORS.white,
    description:
      'Get supportive nudges, win weekly wild cards and join the Group Chat to boost accountability!',
    bgColor: COLORS.primary.welcome.secondary,
    buttonColor: COLORS.primary.welcome.tertiary,
  },
];

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { welcomeScreenStep, setWelcomeScreenStep, setWelcomeScreenCompleted } =
    useWelcomeScreenStore();

  const handleSkip = () => {
    setWelcomeScreenCompleted(true);
    navigation.navigate(SCREEN_NAMES.AUTH as never);
  };

  const handleNext = () => {
    if (welcomeScreenStep < WelcomeScreens.length - 1) {
      setWelcomeScreenStep(welcomeScreenStep + 1);
    } else {
      setWelcomeScreenCompleted(true);
      navigation.navigate(SCREEN_NAMES.AUTH as never);
    }
  };

  const currentScreen = useMemo(
    () => WelcomeScreens[welcomeScreenStep],
    [welcomeScreenStep]
  );
  const isFirstStep = useMemo(
    () => welcomeScreenStep === 0,
    [welcomeScreenStep]
  );
  const isLastStep = useMemo(
    () => welcomeScreenStep === WelcomeScreens.length - 1,
    [welcomeScreenStep]
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <RNImage
          source={currentScreen.image}
          style={isFirstStep ? styles.logo : styles.image}
          resizeMode={isFirstStep ? 'contain' : 'cover'}
        />
      </View>

      <View style={styles.transitionIcon}>
        <RNImage source={currentScreen.mark} style={styles.markIcon} />
      </View>

      <View
        style={[
          styles.textContainer,
          { backgroundColor: currentScreen.bgColor },
        ]}
      >
        <Text style={[styles.title, { color: currentScreen.titleColor }]}>
          {currentScreen.title}
        </Text>

        {currentScreen.description && (
          <Text style={styles.description}>{currentScreen.description}</Text>
        )}

        <View
          style={[
            styles.buttonContainer,
            isLastStep && styles.buttonContainerLast,
          ]}
        >
          {isFirstStep ? (
            <CustomButton
              text="GET STARTED"
              textStyle={styles.buttonText}
              buttonStyle={styles.buttonStyle}
              onPress={handleNext}
            />
          ) : (
            <>
              {!isLastStep && (
                <CustomButton
                  text="Skip"
                  textStyle={styles.buttonText}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: currentScreen.buttonColor,
                    width: '48%',
                  }}
                  onPress={handleSkip}
                />
              )}
              <CustomButton
                text="Next"
                buttonStyle={{
                  ...styles.buttonStyle,
                  backgroundColor: currentScreen.buttonColor,
                  width: isLastStep ? '80%' : '48%',
                }}
                textStyle={styles.buttonText}
                onPress={handleNext}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 0.75 * DEVICE_WIDTH,
    flex: 1,
    resizeMode: 'contain',
  },
  imageContainer: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 48,
    fontFamily: FONTS.family.poppinsSemiBold,
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 32,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.white,
    maxWidth: '100%',
  },
  buttonStyle: {
    width: DEVICE_WIDTH * 0.8,
    height: 56,
    backgroundColor: COLORS.primary.pink.bright_1,
    borderRadius: 28,
    shadowColor: COLORS.primary.pink.bright_1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONTS.family.poppinsSemiBold,
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: DEVICE_WIDTH * 0.8,
    gap: 20,
    justifyContent: 'space-between',
  },
  buttonContainerLast: {
    justifyContent: 'center',
  },
  transitionIcon: {
    position: 'absolute',
    top: DEVICE_HEIGHT * 0.4 - 36,
    borderRadius: 16,
    zIndex: 1,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  markIcon: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
});
