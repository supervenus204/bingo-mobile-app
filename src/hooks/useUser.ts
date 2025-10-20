import { useMemo, useState } from 'react';
import {
  changePassword,
  ChangePasswordData,
  deleteAccount,
  getUserProfile,
  updateProfile,
  UpdateProfileData,
  uploadImage,
} from '../services/user.service';
import { useAuthStore } from '../store/auth.store';

export const useUser = () => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (data: UpdateProfileData) => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await updateProfile(data);
      setUser({
        firstName: updatedUser.first_name || '',
        lastName: updatedUser.last_name || '',
        country: updatedUser.country || '',
        image: updatedUser.image,
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.display_name,
        timezone: updatedUser.timezone,
        pushReminders: updatedUser.push_reminders,
      });

      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeUserPassword = async (data: ChangePasswordData) => {
    try {
      setLoading(true);
      setError(null);

      await changePassword(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to change password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadUserAvatar = async (imageUri: string) => {
    try {
      setLoading(true);
      setError(null);

      const { imageUrl } = await uploadImage(imageUri);

      // Update user with new avatar URL
      if (user) {
        const updatedUser = { ...user, image: imageUrl };
        setUser(updatedUser);
      }

      return imageUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await getUserProfile();
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      await deleteAccount();

      // Clear user data after successful deletion
      useAuthStore.getState().logout();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return useMemo(
    () => ({
      // User data
      user,
      loading,
      error,

      // Actions
      updateProfile: updateUserProfile,
      changePassword: changeUserPassword,
      uploadAvatar: uploadUserAvatar,
      refreshProfile: refreshUserProfile,
      deleteAccount: deleteUserAccount,
      clearError,
    }),
    [user, loading, error]
  );
};
