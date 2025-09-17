import { useContext } from 'react';
import { ToastContext } from '../provider/toast.provider';

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    context.show({ message, type });
  };

  return {
    showToast,
    hide: context.hide,
    isVisible: context.isVisible,
  };
}
