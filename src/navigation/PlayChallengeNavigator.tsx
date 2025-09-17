import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREEN_NAMES } from '../constants/screens';
import { EnterWeight } from '../screens/play-challenge/EnterWeight';
import { GroupChat } from '../screens/play-challenge/GroupChat';
import { HomeScreen } from '../screens/play-challenge/Home';
import { Leaderboard } from '../screens/play-challenge/Leaderboard';
import { Manage } from '../screens/play-challenge/Manage';
import { Profile } from '../screens/play-challenge/Profile';
import { useChallengesStore } from '../store';
import { ChallengeStackParamList } from './types';

const Stack = createNativeStackNavigator<ChallengeStackParamList>();

// Wrapper components that include the bottom tab
const HomeScreenWithTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <HomeScreen />
      <CustomBottomTab currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.HOME} />
    </View>
  );
};

const ProfileScreenWithTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <Profile />
      <CustomBottomTab currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.PROFILE} />
    </View>
  );
};

const ManageScreenWithTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <Manage />
      <CustomBottomTab currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.MANAGE} />
    </View>
  );
};

const GroupChatScreenWithTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <GroupChat />
      <CustomBottomTab currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.GROUP_CHAT} />
    </View>
  );
};

const LeaderboardScreenWithTab = () => {
  return (
    <View style={{ flex: 1 }}>
      <Leaderboard />
      <CustomBottomTab
        currentRoute={SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD}
      />
    </View>
  );
};

const CustomBottomTab = ({ currentRoute }: { currentRoute: string }) => {
  const navigation = useNavigation();

  const tabs = [
    { name: SCREEN_NAMES._PLAY_CHALLENGE.HOME, label: 'Home', icon: 'home' },
    {
      name: SCREEN_NAMES._PLAY_CHALLENGE.PROFILE,
      label: 'Profile',
      icon: 'person',
    },
    {
      name: SCREEN_NAMES._PLAY_CHALLENGE.MANAGE,
      label: 'Manage',
      icon: 'settings',
    },
    {
      name: SCREEN_NAMES._PLAY_CHALLENGE.GROUP_CHAT,
      label: 'Chat',
      icon: 'chat',
    },
    {
      name: SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD,
      label: 'Leaderboard',
      icon: 'leaderboard',
    },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.name as never)}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={currentRoute === tab.name ? '#3b82f6' : '#6b7280'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const PlayChallengeNavigator = () => {
  const { currentChallenge } = useChallengesStore();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREEN_NAMES._PLAY_CHALLENGE.HOME}
    >
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.HOME}
        component={HomeScreenWithTab}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.ENTER_WEIGHT}
        component={EnterWeight}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.PROFILE}
        component={ProfileScreenWithTab}
      />
      {currentChallenge?.is_organizer && (
        <Stack.Screen
          name={SCREEN_NAMES._PLAY_CHALLENGE.MANAGE}
          component={ManageScreenWithTab}
        />
      )}

      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.GROUP_CHAT}
        component={GroupChatScreenWithTab}
      />
      <Stack.Screen
        name={SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD}
        component={LeaderboardScreenWithTab}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 2,
  },
});
