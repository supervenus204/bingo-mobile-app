import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREEN_NAMES } from '../../constants/screens';
import { useChallengesStore } from '../../store';
import { COLORS } from '../../theme';

type FooterProps = {
  currentRoute: string;
};

export const Footer: React.FC<FooterProps> = ({ currentRoute }) => {
  const navigation = useNavigation();
  const { currentChallenge } = useChallengesStore();

  const isOrganizer = Boolean(currentChallenge?.is_organizer);

  const tabs = [
    { name: SCREEN_NAMES._PLAY_CHALLENGE.BINGO, icon: 'grid-view', label: 'Bingo' },
    { name: SCREEN_NAMES._PLAY_CHALLENGE.CHAT, icon: 'chat', label: 'Chat' },
    { name: SCREEN_NAMES._PLAY_CHALLENGE.LEADERBOARD, icon: 'leaderboard', label: 'Leaderboard' },
    isOrganizer
      ? { name: SCREEN_NAMES._PLAY_CHALLENGE.USERS, icon: 'group', label: 'Users' }
      : null,
    { name: SCREEN_NAMES._PLAY_CHALLENGE.SETTINGS, icon: 'settings', label: 'Settings' },
  ].filter(Boolean) as { name: string; icon: string; label: string }[];

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.name as never)}
          activeOpacity={0.7}
        >
          <Icon
            name={tab.icon}
            size={24}
            color={currentRoute === tab.name ? COLORS.green.forest : '#6b7280'}
          />
        </TouchableOpacity>
      ))}
    </View>
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
});

export default Footer;
