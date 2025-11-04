import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.type';

import { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREEN_NAMES } from '../constants';
import { OnboardingScreen, WelcomeScreen } from '../screens';
import { useAuthStore } from '../store/auth.store';
import { AuthNavigator } from './AuthNavigator';
import { CreateChallengeNavigator } from './CreateChallengeNavigator';
import { DashboardNavigator } from './DashboardNavigator';
import { PlayChallengeNavigator } from './PlayChallengeNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuthStore();

  const initialRouteName = useMemo(() => {
    if (isAuthenticated) {
      return SCREEN_NAMES.DASHBOARD;
    }
    return SCREEN_NAMES.AUTH;
  }, [isAuthenticated]);

  return (
    <>
      <StatusBar hidden={true} />

      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
            },
          }}
          initialRouteName={initialRouteName}
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
          <Stack.Screen
            name={SCREEN_NAMES.PLAY_CHALLENGE}
            component={PlayChallengeNavigator}
          />
          <Stack.Screen
            name={SCREEN_NAMES.CREATE_CHALLENGE}
            component={CreateChallengeNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
