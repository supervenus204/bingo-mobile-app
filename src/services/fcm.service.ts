import messaging from '@react-native-firebase/messaging';
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

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

export const registerFCMToken = async (token: string): Promise<void> => {
  try {
    await apiFetch('/api/user/fcm-token', 'POST', { fcm_token: token });
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    throw error;
  }
};

export const deleteFCMToken = async (): Promise<void> => {
  try {
    await messaging().deleteToken();
  } catch (error) {
    console.error('Failed to delete FCM token:', error);
  }
};

