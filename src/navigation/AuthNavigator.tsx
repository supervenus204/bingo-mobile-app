import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import {
  ForgotPasswordScreen,
  SignInScreen,
  SignUpScreen,
  VerifyCodeScreen,
} from '../screens';
import { AuthStackParamList } from '../types/navigation.type';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.SIGN_IN}
        component={SignInScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.SIGN_UP}
        component={SignUpScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.VERIFY_CODE}
        component={VerifyCodeScreen}
      />
      <Stack.Screen
        name={SCREEN_NAMES._AUTH.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};
