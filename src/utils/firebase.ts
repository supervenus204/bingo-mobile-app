import '@react-native-firebase/app';
import { getApp } from '@react-native-firebase/app';
import { getDatabase as getFirebaseDatabase, ref } from '@react-native-firebase/database';
import { FirebaseMessagingTypes, getMessaging } from '@react-native-firebase/messaging';

export const getDatabase = getFirebaseDatabase;

export const getRealtimeDatabaseRef = (path: string) => {
  const db = getFirebaseDatabase();
  return ref(db, path);
};

const waitForFirebase = async (maxRetries = 10, delay = 100): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      getApp();
      return true;
    } catch {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
};

export const getMessagingSafe = async (): Promise<FirebaseMessagingTypes.Module | null> => {
  try {
    const isReady = await waitForFirebase();
    if (!isReady) {
      return null;
    }
    return getMessaging();
  } catch {
    return null;
  }
};

