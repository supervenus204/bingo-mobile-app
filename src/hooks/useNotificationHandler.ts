import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { SCREEN_NAMES } from '../constants';
import { navigationRef } from '../navigation/AppNavigator';
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
      console.log('Foreground notification received:', remoteMessage);

      const notification = remoteMessage.notification;
      const body = notification?.body || 'You have a new message';

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

