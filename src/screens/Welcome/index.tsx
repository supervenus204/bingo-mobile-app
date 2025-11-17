import { useNavigation } from '@react-navigation/native';
import React, { useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from '../../components/common';
import { SCREEN_NAMES } from '../../constants/screens';
import { useWelcomeScreenStore } from '../../store';
import { COLORS, FONTS } from '../../theme';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const WelcomeScreens = [
  {
    image: require('../../assets/images/welcome/logo.png'),
    mark: require('../../assets/images/welcome/mark-1.png'),
    title: 'Join fun health challenges with friends and family.',
    titleColor: COLORS.primary.blue,
    bgColor: COLORS.primary.green,
    buttonColor: COLORS.primary.pink,
  },
  {
    image: require('../../assets/images/welcome/image-1.png'),
    mark: require('../../assets/images/welcome/mark-1.png'),
    title: 'Turn Habits Into Fun!',
    titleColor: COLORS.primary.white,
    description:
      'Join challenges with friends & family, check off tasks, earn points, and celebrate every healthy win together',
    bgColor: COLORS.primary.blue,
    buttonColor: COLORS.primary.pink,
  },
  {
    image: require('../../assets/images/welcome/image-2.png'),
    mark: require('../../assets/images/welcome/mark-2.png'),
    title: 'Track Your Weekly Wins!',
    titleColor: COLORS.primary.white,
    description:
      'Mark off tasks, log your weight-ins, and watch your progress climb up the leaderboard each week!',
    bgColor: COLORS.primary.green,
    buttonColor: COLORS.primary.blue,
  },
  {
    image: require('../../assets/images/welcome/image-3.png'),
    mark: require('../../assets/images/welcome/mark-3.png'),
    title: 'Stay Motivated Together',
    titleColor: COLORS.primary.white,
    description:
      'Get supportive nudges, win weekly wild cards and join the Group Chat to boost accountability!',
    bgColor: COLORS.primary.pink,
    buttonColor: COLORS.primary.blue,
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
        <Image
          source={currentScreen.image}
          style={styles.image}
          resizeMode={isFirstStep ? 'contain' : 'cover'}
        />
      </View>

      <View style={styles.transitionIcon}>
        <Image source={currentScreen.mark} style={styles.markIcon} />
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
              buttonStyle={{
                ...styles.buttonStyle,
                backgroundColor: currentScreen.buttonColor,
                width: '100%',
              }}
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
    backgroundColor: COLORS.primary.white,
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
    gap: 24,
    padding: 32,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: FONTS.family.poppinsSemiBold,
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: FONTS.family.poppinsRegular,
    color: COLORS.primary.white,
    maxWidth: '100%',
  },
  buttonStyle: {
    height: 48,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.primary.white,
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
