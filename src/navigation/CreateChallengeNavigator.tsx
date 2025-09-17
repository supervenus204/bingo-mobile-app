import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SCREEN_NAMES } from '../constants/screens';
import { CardSetup } from '../screens/create-challenge/cardsetup.screen';
import { ChallengePublished } from '../screens/create-challenge/challenge-published.screen';
import { ChoosePlan } from '../screens/create-challenge/ChoosePlan';
import { DefineChallenge } from '../screens/create-challenge/DefineChallenge';
import { InviteParticipants } from '../screens/create-challenge/InviteParticipants';
import { CreateChallengeStackParamList } from './types';

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
        name={SCREEN_NAMES._CREATE_CHALLENGE.CHALLENGE_PUBLISHED}
        component={ChallengePublished}
      />
    </Stack.Navigator>
  );
};
