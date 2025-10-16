import { AuthUser } from '../store/auth.store';
import { apiFetch } from '../utils';

export interface UpdateProfileData {
  display_name?: string;
  country?: string;
  timezone?: string;
  push_reminders?: boolean;
  image?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const checkDisplayName = async (displayName: string): Promise<boolean> => {
  const response = await apiFetch('/api/user/check-display-name', 'POST', {
    display_name: displayName,
  });
  return response.available;
};

export const updateProfile = async (data: UpdateProfileData): Promise<any> => {
  const response = await apiFetch('/api/user/profile', 'PATCH', data);
  return response;
};

export const changePassword = async (
  data: ChangePasswordData
): Promise<void> => {
  await apiFetch('/api/user/change-password', 'POST', {
    current_password: data.currentPassword,
    new_password: data.newPassword,
  });
};

export const uploadImage = async (
  imageUri: string
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  } as any);

  const response = await fetch('/api/user/upload-image', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
};

export const getUserProfile = async (): Promise<AuthUser> => {
  const response = await apiFetch('/api/user/profile', 'GET', {});
  return response;
};

export const deleteAccount = async (): Promise<void> => {
  await apiFetch('/api/user/account', 'DELETE', {});
};
