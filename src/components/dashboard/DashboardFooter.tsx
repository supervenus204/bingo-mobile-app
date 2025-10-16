import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SCREEN_NAMES } from '../../constants';
import { RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/auth.store';
import { COLORS, FONTS } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DashboardFooterProps {
  onProfilePress?: () => void;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({
  onProfilePress,
}) => {
  const { logout } = useAuthStore();
  const navigation = useNavigation<NavigationProp>();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: SCREEN_NAMES.WELCOME }],
            });
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate(SCREEN_NAMES.DASHBOARD, {
        screen: SCREEN_NAMES._DASHBOARD.PROFILE,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Profile Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray.light,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.gray.light,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.red.bright,
  },
  buttonText: {
    fontSize: FONTS.size.sm,
    fontFamily: FONTS.family.poppinsMedium,
    color: COLORS.blue.oxford,
  },
  logoutButtonText: {
    color: COLORS.white,
  },
});
