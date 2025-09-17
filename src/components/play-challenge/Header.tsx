import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SCREEN_NAMES } from '../../constants/screens';
import { useAuthStore, useChallengesStore } from '../../store';
import { COLORS, FONTS } from '../../theme';
import { Challenge } from '../../types/challenge.type';
import { Label } from '../ui/Label';
import { Sidebar } from './Sidebar';

type Props = {
  title: string;
  current_week: number;
};

export const Header: React.FC<Props> = ({ title, current_week }) => {
  const navigation = useNavigation();
  const { setCurrentChallenge } = useChallengesStore();
  const [showSidebar, setShowSidebar] = useState(false);

  const { logout } = useAuthStore();

  const handleHomePress = () => {
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  const handleSwitchChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setShowSidebar(false);
    navigation.navigate(SCREEN_NAMES.PLAY_CHALLENGE as never);
  };

  const handleProfile = () => {
    setShowSidebar(false);
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(SCREEN_NAMES.DASHBOARD, {
        screen: SCREEN_NAMES._DASHBOARD.PROFILE,
      });
    }
    // Navigate to profile screen
    console.log('Navigate to profile');
  };

  const handleLogout = async () => {
    await logout();

    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(SCREEN_NAMES.AUTH);
    }

    setShowSidebar(false);
    // Handle logout logic
  };

  const handleGoToDashboard = () => {
    setShowSidebar(false);
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(SCREEN_NAMES.DASHBOARD);
    }
  };

  const handleGoToInputWeight = () => {
    navigation.navigate(SCREEN_NAMES._PLAY_CHALLENGE.ENTER_WEIGHT as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <TouchableOpacity
          onPress={handleHomePress}
          activeOpacity={0.8}
          style={styles.homeButton}
        >
          <Icon name="menu" size={24} color={COLORS.blue.oxford} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>
      <View style={styles.rightRow}>
        <TouchableOpacity
          onPress={handleGoToInputWeight}
          activeOpacity={0.8}
          style={styles.weightButton}
        >
          <Image
            source={require('../../assets/images/play-challenge/input-weight.png')}
            style={styles.weightIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Label
          text={`WEEK ${current_week}`}
          variant="primary"
          labelStyle={styles.weekPill}
        />
      </View>

      <Sidebar
        visible={showSidebar}
        onClose={handleCloseSidebar}
        onSwitchChallenge={handleSwitchChallenge}
        onProfile={handleProfile}
        onLogout={handleLogout}
        onGoToDashboard={handleGoToDashboard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  homeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.gray.light,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTS.family.poppinsBold,
    color: COLORS.blue.oxford,
  },
  weekPill: {
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weightButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  weightIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.blue.oxford,
  },
});
