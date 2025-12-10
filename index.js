/**
 * @format
 */

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

try {
messaging().setBackgroundMessageHandler(async remoteMessage => {
});
} catch (error) {
}

AppRegistry.registerComponent(appName, () => App);
