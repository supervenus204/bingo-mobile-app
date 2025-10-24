import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { ArchivedChallenge, EnterCode, JoinChallenge, OngoingChallenge, Profile, ScanQRCode } from '../screens/dashboard';
import { DashboardStackParamList } from '../types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREEN_NAMES._DASHBOARD.ONGOING_CHALLENGE}
    >
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.ONGOING_CHALLENGE}
        component={OngoingChallenge}
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
        name={SCREEN_NAMES._DASHBOARD.SCAN_QR_CODE}
        component={ScanQRCode}
      />
      <Stack.Screen
        name={SCREEN_NAMES._DASHBOARD.PROFILE}
        component={Profile}
      />
    </Stack.Navigator>
  );
};
