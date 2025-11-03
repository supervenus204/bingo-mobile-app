import { useContext } from 'react';
import { NotificationContext } from '../provider/notification.provider';

export const useNotificationBanner = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotificationBanner must be used within NotificationProvider');
  }

  return context;
};

