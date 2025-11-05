import { getMessaging, onTokenRefresh } from '@react-native-firebase/messaging';
import { useEffect, useRef } from 'react';
import { deleteFCMToken, getFCMToken, registerFCMToken, requestNotificationPermission } from '../services/fcm.service';
import { useAuthStore } from '../store/auth.store';

export const useFCM = () => {
  const { isAuthenticated, token } = useAuthStore();
  const tokenRegisteredRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const setupFCM = async () => {
      try {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          return;
        }

        const fcmToken = await getFCMToken();
        if (fcmToken && !tokenRegisteredRef.current) {
          try {
            await registerFCMToken(fcmToken);
            tokenRegisteredRef.current = true;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('Network request failed') || errorMessage.includes('NetworkError')) {
              // Silently handle network errors - will retry on next app open or token refresh
              return;
            }
          }
        }
      } catch (error) {
        // Silently handle setup errors
      }
    };

    setupFCM();

    const messaging = getMessaging();
    const unsubscribeTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
      const { isAuthenticated: currentAuthState, token: currentToken } = useAuthStore.getState();
      if (!currentAuthState || !currentToken) {
        return;
      }

      try {
        await registerFCMToken(newToken);
        tokenRegisteredRef.current = true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Session expired') ||
          errorMessage.includes('Network request failed') ||
          errorMessage.includes('NetworkError')) {
          return;
        }
      }
    });

    return () => {
      unsubscribeTokenRefresh();
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated) {
      tokenRegisteredRef.current = false;
      deleteFCMToken().catch(() => {
        // Silently handle delete errors
      });
    }
  }, [isAuthenticated]);
};

