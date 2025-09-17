import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { ActiveChallenge } from '../screens/dashboard/ActiveChallenge';
import { ArchivedChallenge } from '../screens/dashboard/ArchivedChallenge';
import { EnterCode } from '../screens/dashboard/EnterCode';
import { JoinChallenge } from '../screens/dashboard/JoinChallenge';
import { Profile } from '../screens/dashboard/Profile';
import { DashboardStackParamList } from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREEN_NAMES._DASHBOARD.ACTIVE_CHALLENGE}
    >
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.ACTIVE_CHALLENGE}
        component={ActiveChallenge}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.ARCHIVED_CHALLENGE}
        component={ArchivedChallenge}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.ENTER_CODE}
        component={EnterCode}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.JOIN_CHALLENGE}
        component={JoinChallenge}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.PROFILE}
        component={Profile}
      />
    </Stack.Navigator>
  );
};
