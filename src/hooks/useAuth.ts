import { useMemo } from 'react';
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
