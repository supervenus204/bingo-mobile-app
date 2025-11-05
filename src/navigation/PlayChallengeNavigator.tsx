import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { Footer, Header } from '../components/play-challenge';
import { SCREEN_NAMES } from '../constants/screens';
import { BingoScreen, ChatScreen, LeaderboardScreen, ParticipantManagementScreen, SettingsScreen, WeighInScreen } from '../screens/play-challenge';
import { useChallengesStore } from '../store';
import { ChallengeStackParamList } from '../types/navigation.type';

const Stack = createNativeStackNavigator<ChallengeStackParamList>();

export const LayoutWrapper = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { selectedChallenge } = useChallengesStore();
    const title = selectedChallenge?.title || 'Bingo';

    return (
      <View style={{ flex: 1 }}>
        <Header title={title} />
        <Component {...props} />
        <Footer currentRoute={props.route.name} />
      </View>
    );
  };
};

export const PlayChallengeNavigator = () => {
  const { selectedChallenge } = useChallengesStore();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREEN_NAMES._PLAY_CHALLENGE.BINGO}
    >
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.BINGO}
        component={LayoutWrapper(BingoScreen)}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.CHAT}
        component={LayoutWrapper(ChatScreen)}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD}
        component={LayoutWrapper(LeaderboardScreen)}
      />
      {selectedChallenge?.is_organizer && (
        <Stack.Screen
          name={SCREEN_NAMES._PLAY_CHALLENGE.PARTICIPANT_MANAGEMENT}
          component={LayoutWrapper(ParticipantManagementScreen)}
        />
      )}
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.SETTINGS}
        component={LayoutWrapper(SettingsScreen)}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.WEIGH_IN}
        component={LayoutWrapper(WeighInScreen)}
      />
    </Stack.Navigator>
  );
};

