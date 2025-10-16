import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from '../constants';
import {WelcomeScreen} from '../screens/Welcome';
import { OnboardingScreen } from '../screens/Onboarding';
import {WelcomeStackParamList} from './types';

const Stack = createNativeStackNavigator<WelcomeStackParamList>();

export const WelcomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREEN_NAMES.WELCOME}>
      <Stack.Screen
        name={SCREEN_NAMES.WELCOME}
        component={WelcomeScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES.ONBOARDING}
        component={OnboardingScreen}
      />
    </Stack.Navigator>
  );
};
