import { useContext } from 'react';
import { ToastContext } from '../provider/toast.provider';
import type { ToastOptions } from '../types/toast.type';

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const showToast = (
    messageOrOptions: string | ToastOptions,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    if (typeof messageOrOptions === 'string') {
      context.show({ message: messageOrOptions, type });
    } else {
      context.show(messageOrOptions);
    }
  };

  return {
    showToast,
    hide: context.hide,
    isVisible: context.isVisible,
  };
}
