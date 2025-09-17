/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { ToastProvider } from './src/provider';
import { ThemeProvider } from './src/provider/theme.provider';

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';

if (__DEV__) {
  require('./ReactotronConfig');
}

function App(): React.JSX.Element {
  return (
      <ThemeProvider>
        <SafeAreaProvider>
          <ToastProvider>
            <AppNavigator />
          </ToastProvider>
        </SafeAreaProvider>
      </ThemeProvider>
  );
}

export default App;
