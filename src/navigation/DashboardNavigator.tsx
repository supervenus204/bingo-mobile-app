import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { ChallengesListScreen, ProfileScreen } from '../screens/dashboard';
import { useAuthStore } from '../store';
import { DashboardStackParamList } from '../types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => {
  const { user, refreshUser } = useAuthStore();

  useEffect(() => {
    refreshUser();
  }, []);

  const initialRouteName = useMemo(() => {
    if (user) {
      if (user?.displayName && user?.country && user?.timezone) {
        return SCREEN_NAMES._DASHBOARD.CHALLENGES_LIST;
      }
      return SCREEN_NAMES._DASHBOARD.PROFILE;
    }
  }, [user]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.CHALLENGES_LIST}
        component={ChallengesListScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.PROFILE}
        component={ProfileScreen}
      />
    </Stack.Navigator>
  );
};
