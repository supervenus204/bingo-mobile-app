import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '../constants';
import {FirstScreen, OnboardingScreen} from '../screens/welcome';
import {WelcomeStackParamList} from './types';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export const WelcomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREEN_NAMES._WELCOME.FIRSTSCREEN}>
      <Stack.Screen
        name={SCREEN_NAMES._WELCOME.FIRSTSCREEN}
        component={FirstScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._WELCOME.ONBOARDING}
        component={OnboardingScreen}
      />
    </Stack.Navigator>
  );
};
