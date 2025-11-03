import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { NotificationBanner } from '../components/common/NotificationBanner';

type NotificationState = {
  visible: boolean;
  message: string;
  onPress?: () => void;
};

type NotificationContextType = {
  showNotification: (message: string, onPress?: () => void) => void;
  hideNotification: () => void;
};

export const NotificationContext = createContext<NotificationContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
  });

  const showNotification = useCallback((message: string, onPress?: () => void) => {
    setNotification({
      visible: true,
      message,
      onPress,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification({
      visible: false,
      message: '',
      onPress: undefined,
    });
  }, []);

  const handlePress = useCallback(() => {
    if (notification.onPress) {
      notification.onPress();
    }
    hideNotification();
  }, [notification.onPress, hideNotification]);

  const value = useMemo(
    () => ({
      showNotification,
      hideNotification,
    }),
    [showNotification, hideNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationBanner
        visible={notification.visible}
        message={notification.message}
        onPress={handlePress}
        onDismiss={hideNotification}
      />
    </NotificationContext.Provider>
  );
};

