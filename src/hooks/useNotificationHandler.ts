import { getInitialNotification, getMessaging, onMessage, onNotificationOpenedApp } from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { SCREEN_NAMES } from '../constants';
import { navigationRef } from '../navigation/AppNavigator';
import {
  displaySystemNotification,
  getInitialNotificationData,
} from '../services/notification.service';
import { useChallengesStore } from '../store/challenges.store';

export const useNotificationHandler = () => {
  const { ongoingChallenges, selectChallenge } = useChallengesStore();

  useEffect(() => {
    const messaging = getMessaging();

    const handleNotificationNavigation = (data: Record<string, string>) => {
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
        }, 1000);
      }
    };

    const handleInitialNotification = async () => {
      const initialData = await getInitialNotificationData();
      if (initialData) {
        let attempts = 0;
        const maxAttempts = 50;
        const attemptNavigation = () => {
          if (navigationRef.isReady()) {
            handleNotificationNavigation(initialData);
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(attemptNavigation, 100);
          }
        };
        attemptNavigation();
      }
    };

    handleInitialNotification();

    const unsubscribeForeground = onMessage(messaging, async remoteMessage => {
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
    });

    const unsubscribeNotificationOpened = onNotificationOpenedApp(messaging, remoteMessage => {
      const data = remoteMessage?.data;
      if (data) {
        const notificationData: Record<string, string> = {};
        Object.keys(data).forEach(key => {
          const value = data[key];
          if (typeof value === 'string') {
            notificationData[key] = value;
          } else if (value != null) {
            notificationData[key] = String(value);
          }
        });
        handleNotificationNavigation(notificationData);
      }
    });

    if (ongoingChallenges.length > 0) {
      getInitialNotification(messaging)
        .then(remoteMessage => {
          if (remoteMessage) {
            const data = remoteMessage?.data;
            if (data) {
              const notificationData: Record<string, string> = {};
              Object.keys(data).forEach(key => {
                const value = data[key];
                if (typeof value === 'string') {
                  notificationData[key] = value;
                } else if (value != null) {
                  notificationData[key] = String(value);
                }
              });
              handleNotificationNavigation(notificationData);
            }
          }
        });
    }

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }, [ongoingChallenges]);
};

