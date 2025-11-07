import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { OngoingChallenge, Profile } from '../screens/dashboard';
import { DashboardStackParamList } from '../types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREEN_NAMES._DASHBOARD.CHALLENGES_LIST}
    >
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.CHALLENGES_LIST}
        component={OngoingChallenge}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.PROFILE}
        component={Profile}
      />
    </Stack.Navigator>
  );
};
