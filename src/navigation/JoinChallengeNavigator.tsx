import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SCREEN_NAMES } from '../constants/screens';
import { InviteCode, Join, ScanQRCode } from '../screens/join-challenge';
import { JoinChallengeStackParamList } from '../types/navigation.type';

const Stack = createNativeStackNavigator<JoinChallengeStackParamList>();

export const JoinChallengeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={SCREEN_NAMES._JOIN_CHALLENGE.INVITE_CODE}
        component={InviteCode}
      />
      <Stack.Screen name={SCREEN_NAMES._JOIN_CHALLENGE.JOIN} component={Join} />
      <Stack.Screen
        name={SCREEN_NAMES._JOIN_CHALLENGE.SCAN_QR_CODE}
        component={ScanQRCode}
      />
    </Stack.Navigator>
  );
};
