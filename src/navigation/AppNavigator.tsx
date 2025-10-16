import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN_NAMES } from '../constants';
import { AuthNavigator } from './AuthNavigator';
// import { CreateChallengeNavigator } from './CreateChallengeNavigator';
import { DashboardNavigator } from './DashboardNavigator';
// import { PlayChallengeNavigator } from './PlayChallengeNavigator';
import { OnboardingScreen, WelcomeScreen } from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar hidden={true} />

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          }}
          initialRouteName={SCREEN_NAMES.AUTH}
        >
          <Stack.Screen
            name={SCREEN_NAMES.WELCOME}
            component={WelcomeScreen}
          />
          <Stack.Screen
            name={SCREEN_NAMES.ONBOARDING}
            component={OnboardingScreen}
          />
          <Stack.Screen name={SCREEN_NAMES.AUTH} component={AuthNavigator} />
          <Stack.Screen
            name={SCREEN_NAMES.DASHBOARD}
            component={DashboardNavigator}
          />
          {/* <Stack.Screen
            name={SCREEN_NAMES.PLAY_CHALLENGE}
            component={PlayChallengeNavigator}
          />
          <Stack.Screen
            name={SCREEN_NAMES.CREATE_CHALLENGE}
            component={CreateChallengeNavigator}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
