import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { SCREEN_NAMES } from '../constants';
import { navigationRef } from '../navigation/AppNavigator';
import { displaySystemNotification } from '../services/notification.service';
import { useChallengesStore } from '../store/challenges.store';
import { useNotificationBanner } from './useNotificationBanner';

export const useNotificationHandler = () => {
  const { selectChallenge } = useChallengesStore();
  const { showNotification } = useNotificationBanner();

  useEffect(() => {
    const handleNotificationNavigation = (remoteMessage: any) => {
      const data = remoteMessage?.data;
      if (!data || data.type !== 'new_message') {
        return;
      }

      const { challenge_id } = data;
      if (challenge_id && navigationRef.isReady()) {
        selectChallenge(challenge_id);
        setTimeout(() => {
          (navigationRef as any).navigate(SCREEN_NAMES.PLAY_CHALLENGE, {
            screen: SCREEN_NAMES._PLAY_CHALLENGE.CHAT,
          });
        }, 100);
      }
    };

    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      const notification = remoteMessage.notification;
      const data = remoteMessage?.data;

      if (!data || data.type !== 'new_message') {
        return;
      }

      const title = notification?.title || 'New Message';
      const body = notification?.body || 'You have a new message';

      const notificationData: Record<string, string> = {};
      if (data) {
        Object.keys(data).forEach(key => {
          const value = data[key];
          if (typeof value === 'string') {
            notificationData[key] = value;
          } else if (value != null) {
            notificationData[key] = String(value);
          }
        });
      }

      try {
        await displaySystemNotification({
          title,
          body,
          data: notificationData,
        });
      } catch (error) {
        console.error('Error showing notification:', error);
      }

      showNotification(body, () => {
        handleNotificationNavigation(remoteMessage);
      });
    });

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      handleNotificationNavigation(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification from quit state:', remoteMessage);
          handleNotificationNavigation(remoteMessage);
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }, [selectChallenge, showNotification]);
};

