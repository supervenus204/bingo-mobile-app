import { API_BASE_URL } from '../constants/config';
import { useAuthStore } from '../store/auth.store';
import { parseJsonSafe } from './parse-json';

const refreshToken = async () => {
  const { refreshToken: currentRefreshToken, token } = useAuthStore.getState();

  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Refresh-token': currentRefreshToken,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const { data } = await parseJsonSafe(response);
  return data;
};

export const apiFetch = async (
  url: string,
  method: string,
  body: any,
  retryCount = 0
): Promise<any> => {
  const { token, refreshToken: currentRefreshToken } = useAuthStore.getState();

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body:
      method === 'GET' ? undefined : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && retryCount === 0 && currentRefreshToken) {
      try {
        const newTokens = await refreshToken();
        useAuthStore.getState().setToken(newTokens.token);
        useAuthStore.getState().setRefreshToken(newTokens.refreshToken);

        return apiFetch(url, method, body, 1);
      } catch (error) {
        useAuthStore.getState().logout();
        throw new Error('Session expired. Please login again.');
      }
    }

    const { data } = await parseJsonSafe(response);
    const message = (data && (data.message as string)) || 'failed to fetch';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);
  return data;
};
