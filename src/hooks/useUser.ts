import { useEffect, useMemo, useState } from 'react';
import { getImageUrl, removeImage, updateProfile, uploadImage } from '../services/user.service';
import { useAuthStore } from '../store/auth.store';

export const useUser = () => {
  const { user, setUser } = useAuthStore();

  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setImage(user.image ?? null);
      setFirstName(user.firstName ?? '');
      setLastName(user.lastName ?? '');
      setDisplayName(user.displayName ?? '');
      setTimezone(user.timezone ?? '');
      setCountry(user.country ?? '');
    }
  }, [user]);

  const saveProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await updateProfile({
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
        ...(displayName && { display_name: displayName }),
        ...(country && { country: country }),
        ...(timezone && { timezone: timezone }),
      });
      setUser({
        firstName: updatedUser.first_name || '',
        lastName: updatedUser.last_name || '',
        country: updatedUser.country || '',
        image: updatedUser.image,
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.display_name,
        timezone: updatedUser.timezone,
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

  const uploadAvatar = async (imageUri: string) => {
    try {
      setLoading(true);
      setError(null);

      const { image_url } = await uploadImage(imageUri);
      // Update user with new avatar URL
      if (user) {
        const updatedUser = { ...user, image: image_url };
        setUser(updatedUser);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setLoading(true);
      setError(null);

      await removeImage();

      if (user) {
        const updatedUser = { ...user, image: null };
        setUser(updatedUser);
        setImage(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to remove avatar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshImageUrl = async (): Promise<string | null> => {
    try {
      const { imageUrl } = await getImageUrl();

      if (user && imageUrl) {
        const updatedUser = { ...user, image: imageUrl };
        setUser(updatedUser);
        setImage(imageUrl);
      }

      return imageUrl;
    } catch (err) {
      return null;
    }
  };

  const clearError = () => setError(null);

  return useMemo(
    () => ({
      // User data
      user,
      image,
      firstName,
      lastName,
      displayName,
      timezone,
      country,
      loading,
      error,

      // Actions
      saveProfile,
      setFirstName,
      setLastName,
      setDisplayName,
      setTimezone,
      setCountry,
      setImage,
      uploadAvatar,
      removeAvatar,
      refreshImageUrl,
      clearError,
    }),
    [
      image,
      firstName,
      lastName,
      displayName,
      timezone,
      country,
      loading,
      error,
      setFirstName,
      setLastName,
      setDisplayName,
      setTimezone,
      setCountry,
      setImage,
      uploadAvatar,
      removeAvatar,
      refreshImageUrl,
      saveProfile,
      clearError,
    ]
  );
};
