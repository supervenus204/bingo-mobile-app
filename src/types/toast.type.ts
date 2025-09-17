export type ToastType = 'success' | 'error' | 'info';
export type ToastPosition = 'top' | 'bottom';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastOptions = {
  message: string;
  type?: ToastType;
  duration?: number; // ms
  action?: ToastAction;
};
