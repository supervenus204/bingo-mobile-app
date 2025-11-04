import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Toast } from '../components/common';
import type { ToastOptions, ToastPosition } from '../types';

type ToastAPI = {
  show: (opts: ToastOptions | string) => void;
  hide: () => void;
  isVisible: boolean;
};

export const ToastContext = createContext<ToastAPI | null>(null);

type ProviderProps = PropsWithChildren<{
  position?: ToastPosition;
  offset?: number;
  maxWidth?: number;
}>;

export function ToastProvider({
  children,
  position = 'top',
  offset = 12,
  maxWidth = 680,
}: ProviderProps) {
  const [opts, setOpts] = useState<ToastOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRef = useRef<ToastOptions | null>(null); // for smooth replace

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTimer = (duration: number) => {
    clearTimer();
    timeoutRef.current = setTimeout(() => hide(), duration);
  };

  const hide = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, []);

  const show = useCallback(
    (input: ToastOptions | string) => {
      const next: ToastOptions =
        typeof input === 'string' ? { message: input } : input;
      const withDefaults: ToastOptions = {
        type: 'info',
        duration: 2000,
        ...next,
        message: next.message || '1111',
      };

      // If a toast is already visible, fade it out, then show the new one
      if (visible) {
        clearTimer();
        pendingRef.current = withDefaults;
        setVisible(false);
        return;
      }

      setOpts(withDefaults);
      setVisible(true);
      startTimer(withDefaults.duration!);
    },
    [visible]
  );

  const onHidden = useCallback(() => {
    if (pendingRef.current) {
      const toShow = pendingRef.current;
      pendingRef.current = null;
      setOpts(toShow);
      setVisible(true);
      startTimer(toShow.duration ?? 2500);
    } else {
      setOpts(null);
    }
  }, [visible]);

  const value = useMemo<ToastAPI>(
    () => ({ show, hide, isVisible: visible }),
    [show, hide, visible]
  );

  return (
    <ToastContext.Provider value={value}>
      <React.Fragment>
        {children}
        <Toast
          visible={visible}
          options={opts}
          position={position}
          offset={offset}
          maxWidth={maxWidth}
          onRequestClose={hide}
          onHidden={onHidden}
        />
      </React.Fragment>
    </ToastContext.Provider>
  );
}
