import '@react-native-firebase/app';
import database from '@react-native-firebase/database';

export const getDatabase = () => database();

export const getRealtimeDatabaseRef = (path: string) => {
  return database().ref(path);
};

