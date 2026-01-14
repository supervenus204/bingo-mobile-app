import { API_BASE_URL } from '../constants/config';
import { useAuthStore } from '../store/auth.store';
import { apiFetch, parseJsonSafe } from '../utils';

export const getProgress = async (challengeId: string, week?: number) => {
  const url = week
    ? `/api/challenge/${challengeId}/progress?week=${week}`
    : `/api/challenge/${challengeId}/progress`;
  const data = await apiFetch(url, 'GET', {});

  return data;
};

export const updateProgress = async (
  challengeId: string,
  cardNumber: any,
  action: string
) => {
  const token = useAuthStore.getState().token;

  const response = await fetch(
    `${API_BASE_URL}/api/challenge/${challengeId}/progress/${cardNumber}/${action}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to load bingocard';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);
  return data;
};

export const createProgress = async (challengeId: string) => {
  const token = useAuthStore.getState().token;

  const response = await fetch(
    `${API_BASE_URL}/api/challenge/${challengeId}/progress`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const body = await parseJsonSafe(response);
    const message =
      (body && (body.message as string)) || 'Failed to load bingocard';
    throw new Error(message);
  }

  const { data } = await parseJsonSafe(response);
  return data;
};
