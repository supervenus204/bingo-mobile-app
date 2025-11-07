import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { CardSetup } from '../screens/create-challenge/CardSetup';
import { ChallengePublished } from '../screens/create-challenge/ChallengePublished';
import { ChoosePlan } from '../screens/create-challenge/ChoosePlan';
import { DefineChallenge } from '../screens/create-challenge/DefineChallenge';
import { InviteParticipants } from '../screens/create-challenge/InviteParticipants';
import { CreateChallengeStackParamList } from '../types/navigation.type';

const Stack = createNativeStackNavigator<CreateChallengeStackParamList>();

export const CreateChallengeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREEN_NAMES._CREATE_CHALLENGE.CHOOSE_PLAN}
    >
      <Stack.Screen
        name={SCREEN_NAMES._CREATE_CHALLENGE.CHOOSE_PLAN}
        component={ChoosePlan}
      />
      <Stack.Screen
        name={SCREEN_NAMES._CREATE_CHALLENGE.DEFINE_CHALLENGE}
        component={DefineChallenge}
      />
      <Stack.Screen
        name={SCREEN_NAMES._CREATE_CHALLENGE.CARD_SETUP}
        component={CardSetup}
      />
      <Stack.Screen
        name={SCREEN_NAMES._CREATE_CHALLENGE.INVITE_PARTICIPANTS}
        component={InviteParticipants}
      />
      <Stack.Screen
        name={SCREEN_NAMES._CREATE_CHALLENGE.PAY_CHALLENGE}
        component={ChallengePublished}
      />
    </Stack.Navigator>
  );
};
