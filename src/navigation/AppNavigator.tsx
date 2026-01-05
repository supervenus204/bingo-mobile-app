import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation.type';

import { useEffect, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingCard } from '../components/common';
import { SCREEN_NAMES } from '../constants';
import { WelcomeScreen } from '../screens';
import { useAuthStore, useWelcomeScreenStore } from '../store';
import { AuthNavigator } from './AuthNavigator';
import { CreateChallengeNavigator } from './CreateChallengeNavigator';
import { DashboardNavigator } from './DashboardNavigator';
import { JoinChallengeNavigator } from './JoinChallengeNavigator';
import { PlayChallengeNavigator } from './PlayChallengeNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, hasHydrated: hasAuthHydrated } = useAuthStore();
  const { completedWelcomeScreen, hasHydrated: hasWelcomeHydrated } =
    useWelcomeScreenStore();

  const initialRouteName = useMemo(() => {
    if (!hasWelcomeHydrated || !hasAuthHydrated) {
      return null;
    }

    if (!completedWelcomeScreen) {
      return SCREEN_NAMES.WELCOME;
    }
    if (isAuthenticated) {
      return SCREEN_NAMES.DASHBOARD;
    }
    return SCREEN_NAMES.AUTH;
  }, [hasWelcomeHydrated, hasAuthHydrated]);

  useEffect(() => {
    if (
      hasAuthHydrated &&
      hasWelcomeHydrated &&
      completedWelcomeScreen &&
      !isAuthenticated &&
      navigationRef.isReady()
    ) {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute?.name !== SCREEN_NAMES.AUTH) {
        navigationRef.navigate(SCREEN_NAMES.AUTH as never);
      }
    }
  }, [
    isAuthenticated,
    hasAuthHydrated,
    hasWelcomeHydrated,
    completedWelcomeScreen,
  ]);

  return (
    <>
      <StatusBar hidden={true} />

      {!!initialRouteName && (
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
            <Stack.Screen name={SCREEN_NAMES.AUTH} component={AuthNavigator} />
            <Stack.Screen
              name={SCREEN_NAMES.DASHBOARD}
              component={DashboardNavigator}
            />
            <Stack.Screen
              name={SCREEN_NAMES.CREATE_CHALLENGE}
              component={CreateChallengeNavigator}
            />
            <Stack.Screen
              name={SCREEN_NAMES.JOIN_CHALLENGE}
              component={JoinChallengeNavigator}
            />
            <Stack.Screen
              name={SCREEN_NAMES.PLAY_CHALLENGE}
              component={PlayChallengeNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}

      <LoadingCard
        visible={!initialRouteName}
        message="Loading app..."
        subMessage="Please wait while we load the app..."
      />
    </>
  );
};
