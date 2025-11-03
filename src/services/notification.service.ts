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
