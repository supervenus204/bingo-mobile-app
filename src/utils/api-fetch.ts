import { API_BASE_URL } from '../constants/config';
import { useAuthStore } from '../store/auth.store';
import { parseJsonSafe } from './parse-json';

const refreshToken = async () => {
  const { refreshToken: currentRefreshToken, token } = useAuthStore.getState();

  if (!currentRefreshToken) {
    throw new Error('No refresh token available');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Refresh-token': currentRefreshToken,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Network request failed. Please check your connection.';
    throw new Error(errorMessage);
  }

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

  if (!token) {
    throw new Error('No authentication token available');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body:
        method === 'GET' ? undefined : body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      const networkError = new Error('Network request failed. Please check your connection and ensure the server is running.');
      networkError.name = 'NetworkError';
      throw networkError;
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Network request failed. Please check your connection.';
    throw new Error(errorMessage);
  }

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

    try {
      const { data, error } = await parseJsonSafe(response);
      const message =
        (data && (data.message as string)) ||
        (error && (error.message as string)) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message) {
        throw parseError;
      }
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  const { data } = await parseJsonSafe(response);
  return data;
};
