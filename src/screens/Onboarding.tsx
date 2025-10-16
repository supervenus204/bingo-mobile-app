import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/ui';
import { SCREEN_NAMES } from '../constants/screens';
import { useOnboardingStore } from '../store';
import { FONTS } from '../theme';
import { COLORS } from '../theme/_colors';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const setOnboardingCompleted = useOnboardingStore(s => s.setOnboardingCompleted);
  const setOnboardingStep = useOnboardingStore(s => s.setOnboardingStep);
  const onboardingStep = useOnboardingStore(s => s.onboardingStep);

  const pages = useMemo(
    () => [
      {
        image: require('../assets/images/welcome/image-1.png'),
        mark: require('../assets/images/welcome/mark-1.png'),
        title: 'Turn Habits Into Fun!',
        description:
          'Join challenges with friends & family, check off tasks, earn points, and celebrate every healthy win together',
        bgColor: COLORS.welcome?.tertiary,
        buttonColor: COLORS.welcome?.secondary,
      },
      {
        image: require('../assets/images/welcome/image-2.png'),
        mark: require('../assets/images/welcome/mark-2.png'),
        title: 'Track Your Weekly Wins!',
        description:
          'Mark off tasks, log your weight-ins, and watch your progress climb up the leaderboard each week!',
        bgColor: COLORS.welcome?.quaternary,
        buttonColor: COLORS.welcome?.tertiary,
      },
      {
        image: require('../assets/images/welcome/image-3.png'),
        mark: require('../assets/images/welcome/mark-3.png'),
        title: 'Stay Motivated Together',
        description:
          'Get supportive nudges, win weekly wild cards and join the Group Chat to boost accountability!',
        bgColor: COLORS.welcome?.secondary,
        buttonColor: COLORS.welcome?.tertiary,
      },
    ],
    []
  );

  const handleSkip = () => {
    setOnboardingCompleted(true);
    navigation.navigate(SCREEN_NAMES.AUTH as never);
  };

  const handleNext = () => {
    if (onboardingStep < pages.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setOnboardingCompleted(true);
      navigation.navigate(SCREEN_NAMES.AUTH as never);
    }
  };

  const currentPage = pages[onboardingStep];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={currentPage.image}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.transitionIcon]}>
        <Image source={currentPage.mark} style={styles.smallIcon} />
      </View>

      <View
        style={[styles.textContainer, { backgroundColor: currentPage.bgColor }]}
      >
        <Text style={[styles.description, styles.whiteText]}>
          {currentPage.title}
        </Text>

        <Text style={[styles.subDescription, styles.whiteText]}>
          {currentPage.description}
        </Text>

        <View
          style={[
            styles.buttonContainer,
            {
              justifyContent:
                onboardingStep === pages.length - 1
                  ? 'space-around'
                  : 'space-between',
            },
          ]}
        >
          {onboardingStep < pages.length - 1 && (
            <Button
              text="Skip"
              textStyle={styles.buttonText}
              buttonStyle={{
                ...styles.button,
                backgroundColor: currentPage.buttonColor,
                width: '48%',
              }}
              onPress={handleSkip}
            />
          )}
          <Button
            text="Next"
            buttonStyle={{
              ...styles.button,
              backgroundColor: currentPage.buttonColor,
              width: onboardingStep === pages.length - 1 ? '80%' : '48%',
            }}
            textStyle={styles.buttonText}
            onPress={handleNext}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    gap: 42,
  },
  description: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: FONTS.family.poppinsRegular,
    paddingHorizontal: 30,
    paddingTop: 20,
    fontWeight: 'bold',
  },
  subDescription: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.family.poppinsRegular,
    paddingHorizontal: 20,
    maxWidth: '90%',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: DEVICE_WIDTH * 0.8,
    gap: 20,
  },
  button: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 50,
    borderRadius: 12,
    width: '50%',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.family.poppinsRegular,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  transitionIcon: {
    position: 'absolute',
    top: DEVICE_HEIGHT * 0.4 - 25,
    borderRadius: 12,
    zIndex: 1,
    alignSelf: 'center',
  },
  smallIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  buttonHalf: {
    width: '48%',
  },
  whiteText: {
    color: COLORS.white,
  },
});
