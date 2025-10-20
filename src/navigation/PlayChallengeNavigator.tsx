import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { Footer } from '../components/play-challenge/Footer';
import { SCREEN_NAMES } from '../constants/screens';
import { EnterWeight, GroupChat, HomeScreen, Leaderboard, UserManagement, Settings } from '../screens/play-challenge';
import { useChallengesStore } from '../store';
import { ChallengeStackParamList } from './types';

const Stack = createNativeStackNavigator<ChallengeStackParamList>();

// Wrapper components that include the bottom tab
const BingoScreenWithBottomTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
      <Footer currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.BINGO} />
    </View>
  );
};

const ChatScreenWithBottomTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <GroupChat />
      <Footer currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.CHAT} />
    </View>
  );
};

const LeaderboardScreenWithTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <Leaderboard />
      <Footer currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD} />
    </View>
  );
};

const UsersScreenWithBottomTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <UserManagement />
      <Footer currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.USERS} />
    </View>
  );
};

const SettingsScreenWithBottomTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <Settings />
      <Footer currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.SETTINGS} />
    </View>
  );
};


export const PlayChallengeNavigator = () => {
  const { currentChallenge } = useChallengesStore();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREEN_NAMES._PLAY_CHALLENGE.BINGO}
    >
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.BINGO}
        component={BingoScreenWithBottomTab}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.CHAT}
        component={ChatScreenWithBottomTab}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD}
        component={LeaderboardScreenWithTab}
      />
      {currentChallenge?.is_organizer && (
        <Stack.Screen
          name={SCREEN_NAMES._PLAY_CHALLENGE.USERS}
          component={UsersScreenWithBottomTab}
        />
      )}
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.SETTINGS}
        component={SettingsScreenWithBottomTab}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.ENTER_WEIGHT}
        component={EnterWeight}
      />
    </Stack.Navigator>
  );
};

