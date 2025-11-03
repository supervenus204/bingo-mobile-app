/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';

import { StripeProvider } from '@stripe/stripe-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { STRIPE_PUBLISHABLE_KEY } from './src/constants/config';
import { useFCM, useNotificationHandler } from './src/hooks';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastProvider } from './src/provider';
import { NotificationProvider } from './src/provider/notification.provider';
import { ThemeProvider } from './src/provider/theme.provider';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

if (__DEV__) {
  require('./ReactotronConfig');
}

// Component that uses hooks that require ToastProvider
function AppContent(): React.JSX.Element {
  useFCM();
  useNotificationHandler();

  return <AppNavigator />;
}

function App(): React.JSX.Element {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <ThemeProvider>
        <SafeAreaProvider>
          <NotificationProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </NotificationProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </StripeProvider>
  );
}

export default App;
