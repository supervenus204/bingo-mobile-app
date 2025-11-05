import { AuthorizationStatus, deleteToken, getMessaging, getToken, requestPermission } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { apiFetch } from '../utils';
import { requestNotificationPermission as requestAndroidPermission } from './notification.service';

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const androidPermission = await requestAndroidPermission();
      if (!androidPermission) {
        return false;
      }
    }

    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (error) {
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
    return token;
  } catch (error) {
    return null;
  }
};

export const registerFCMToken = async (token: string): Promise<void> => {
  try {
    await apiFetch('/api/user/fcm-token', 'POST', { fcm_token: token });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('No authentication token available')) {
      throw new Error('Session expired');
    }
    throw error;
  }
};

export const deleteFCMToken = async (): Promise<void> => {
  try {
    const messaging = getMessaging();
    await deleteToken(messaging);
  } catch (error) {
    // Silently handle delete errors
  }
};

