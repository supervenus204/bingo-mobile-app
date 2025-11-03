import messaging from '@react-native-firebase/messaging';
import { useEffect, useRef } from 'react';
import { deleteFCMToken, getFCMToken, registerFCMToken, requestNotificationPermission } from '../services/fcm.service';
import { useAuthStore } from '../store/auth.store';

export const useFCM = () => {
  const { isAuthenticated } = useAuthStore();
  const tokenRegisteredRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const setupFCM = async () => {
      try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          console.log('Notification permission denied');
          return;
        }

        const token = await getFCMToken();
        if (token && !tokenRegisteredRef.current) {
          try {
            await registerFCMToken(token);
            tokenRegisteredRef.current = true;
          } catch (error) {
            console.error('Failed to register FCM token:', error);
          }
        }
      } catch (error) {
        console.error('Failed to setup FCM:', error);
      }
    };

    setupFCM();

    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      try {
        await registerFCMToken(newToken);
        tokenRegisteredRef.current = true;
      } catch (error) {
        console.error('Failed to register refreshed FCM token:', error);
      }
    });

    return () => {
      unsubscribeTokenRefresh();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      tokenRegisteredRef.current = false;
      deleteFCMToken().catch(console.error);
    }
  }, [isAuthenticated]);
};

