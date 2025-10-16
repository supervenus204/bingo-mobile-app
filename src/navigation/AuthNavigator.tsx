import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { ProfileSetupScreen } from '../screens';
import { SignInScreen } from '../screens/auth/SignIn';
import { SignUpScreen } from '../screens/auth/SignUp';
import { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.SIGN_IN}
        component={SignInScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.SIGN_UP}
        component={SignUpScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.PROFILE_SETUP}
        component={ProfileSetupScreen}
      />
    </Stack.Navigator>
  );
};
