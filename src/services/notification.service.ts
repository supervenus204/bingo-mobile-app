import { NativeModules, Platform } from 'react-native';

const { NotificationModule } = NativeModules;

interface NotificationPayload {
  title?: string;
  body: string;
  data?: Record<string, string>;
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    if (!NotificationModule?.requestNotificationPermission) {
      return false;
    }

    return await NotificationModule.requestNotificationPermission();
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

export const displaySystemNotification = async (
  payload: NotificationPayload
): Promise<void> => {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    if (!NotificationModule?.showNotification) {
      console.warn('NotificationModule not available');
      return;
    }

    await NotificationModule.showNotification(
      payload.title || 'New Message',
      payload.body,
      payload.data || {}
    );
  } catch (error) {
    console.error('Failed to display system notification:', error);
  }
};

export const getInitialNotificationData = async (): Promise<Record<string, string> | null> => {
  if (Platform.OS !== 'android') {
    return null;
  }

  try {
    if (!NotificationModule?.getInitialNotificationData) {
      return null;
    }

    const data = await NotificationModule.getInitialNotificationData();
    if (!data) {
      return null;
    }

    const result: Record<string, string> = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (typeof value === 'string') {
        result[key] = value;
      }
    });

    return Object.keys(result).length > 0 ? result : null;
  } catch (error) {
    console.error('Failed to get initial notification data:', error);
    return null;
  }
};
