import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { SCREEN_NAMES } from '../constants';
import {
  signInService,
  signInWithGoogleService,
  signUpService,
} from '../services';
import { useAuthStore } from '../store';

export const useAuth = () => {
  const {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    setToken,
    setUser,
    setError,
    setLoading,
    setAuthenticated,
    setRefreshToken,
  } = useAuthStore();

  const navigation = useNavigation();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data } = await signInService(email, password);

      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setUser({
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        image: data.user.image,
        id: data.user.id,
        displayName: data.user.display_name,
        timezone: data.user.timezone,
        pushReminders: data.user.push_reminders,
      });
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      setLoading(true);
      const { data } = await signInWithGoogleService(idToken);

      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setUser({
        email: data.user.email,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        image: data.user.image,
        id: data.user.id,
        displayName: data.user.display_name,
        timezone: data.user.timezone,
        pushReminders: data.user.push_reminders,
      });
      setAuthenticated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign in with Google'
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      setLoading(true);
      const { data } = await signUpService(
        firstName,
        lastName,
        email,
        password
      );
      setToken(data.token);
      navigation.navigate(SCREEN_NAMES._AUTH.PROFILE_SETUP as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return useMemo(
    () => ({
      signIn,
      signUp,
      signInWithGoogle,
      token,
      isAuthenticated,
      user,
      loading,
      error,
    }),
    [
      signIn,
      signUp,
      signInWithGoogle,
      token,
      isAuthenticated,
      user,
      loading,
      error,
    ]
  );
};
