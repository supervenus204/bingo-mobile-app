import '@react-native-firebase/app';
import { getDatabase as getFirebaseDatabase, ref } from '@react-native-firebase/database';

export const getDatabase = getFirebaseDatabase;

export const getRealtimeDatabaseRef = (path: string) => {
  const db = getFirebaseDatabase();
  return ref(db, path);
};

